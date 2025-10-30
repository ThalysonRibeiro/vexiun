"use client"

import { useGroupActions, useGroupItemByEntityStatus } from "@/hooks/use-groups";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Archive, ChevronDown, FolderOpen, LayoutGrid, Logs, Trash } from "lucide-react";
import { useItemActions } from "@/hooks/use-items";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ActionGroup } from "./main-board/group/action-group";
import { TitleGroup } from "./main-board/group/title-group";
import { ItemLifecycleView } from "./main-board/items/item-lifecycle-view";
import { EmptyState } from "../../../../../../components/ui/empty-state";
import { Banner } from "@/components/ui/banner";
import { EntityStatus, WorkspaceRole } from "@/generated/prisma";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSession } from "next-auth/react";
import { useWorkspaceMemberData, useWorkspacePermissions } from "@/hooks/use-workspace";

interface ItemLifecycleManagerProps {
  workspaceId: string;
  entityStatus: EntityStatus;
}

export function ItemLifecycleManager({
  workspaceId,
  entityStatus
}: ItemLifecycleManagerProps) {
  const [changeLayout, setChangeLayout] = useState<boolean>(false);
  const { data, isLoading: isLoadingStatus } = useGroupItemByEntityStatus(workspaceId, entityStatus);

  const { data: session } = useSession();
  const { data: workspace } = useWorkspaceMemberData(workspaceId as string);

  const currentUserId = session?.user.id;
  const isOwner = workspace?.workspace.userId === currentUserId;
  const permissions = useWorkspacePermissions({
    userRole: workspace?.member.role as WorkspaceRole ?? "VIEWER",
    workspaceStatus: entityStatus as EntityStatus,
    isOwner
  });

  const {
    isLoading: isLoadingGroup,
    isAddingGroup,
    editingGroupId,
    openGroups,
    setIsAddingGroup,
    toggleDropdown,
    handleEditGroup,
    closeEditForm,
    closeAddGroupForm,
    handleDeleteGroup,
    handleMoveToTrash: handleMoveToTrashGroup,
    handleArchiveGroup,
    handleRestoreGroup
  } = useGroupActions(workspaceId);

  const {
    dialogState,
    editing,
    editingData,
    isLoading,
    setDialogState,
    setEditingData,
    startEditing,
    cancelEditing,
    handleSaveDetails,
    handleSaveField,
    handleSelectChange,
    handleDeleteItem,
    handleMoveToTrash,
    handleArchiveItem,
    handleRestoreItem
  } = useItemActions(workspaceId);

  const commonProps = {
    changeLayout,
    isLoading,
    editing,
    editingData,
    dialogState,
    onStartEditing: startEditing,
    onCancelEditing: cancelEditing,
    onSaveField: handleSaveField,
    onSelectChange: handleSelectChange,
    onDeleteItem: handleDeleteItem,
    onMoveToTrash: handleMoveToTrash,
    onArchiveItem: handleArchiveItem,
    onRestoreItem: handleRestoreItem,
    onSaveDetails: handleSaveDetails,
    setEditingData,
    setDialogState,
  };

  const emptyStateConfig = {
    ACTIVE: {
      icon: FolderOpen,
      title: "Nenhum Grupo ativo",
      description: "Você ainda não tem nenhum Grupo. Crie um para começar!",
    },
    ARCHIVED: {
      icon: Archive,
      title: "Nenhum Grupo arquivado",
      description: "Grupos e items arquivados aparecerão aqui.",
    },
    DELETED: {
      icon: Trash,
      title: "A lixeira está vazia",
      description: "Grupos e items deletados aparecerão aqui por 30 dias.",
    },
  };

  if (isLoadingGroup || isLoading || isLoadingStatus) {
    return <LoadingSpinner />
  }

  if (!data || data?.length === 0) {
    const config = emptyStateConfig[entityStatus];
    return (
      <EmptyState
        icon={config.icon}
        title={config.title}
        description={config.description}
      />
    )
  }

  return (
    <section>
      {entityStatus === "DELETED" && (
        <Banner
          icon={Trash}
          title="Atenção"
          description="Grupos e items na lixeira serão deletados permanentemente em 30 dias. Restaure-os antes disso para não perder seus dados."
          variant="destructive"
          className="mb-2"
        />
      )}
      <Button
        onClick={() => setChangeLayout(prev => !prev)}
        variant="outline"
        className="cursor-pointer"
      >
        {changeLayout ? <Logs /> : <LayoutGrid />}
        <span>Layout</span>
        {changeLayout ? "lista" : "grid"}
      </Button>

      <div className="space-y-2 mb-4">
        {data?.map((group) => {
          const isGroupOpen = openGroups.has(group.id);
          return (
            <div key={group.id} className="space-y-2">
              <div className="flex items-center gap-1 mt-4">
                {permissions.canRestore && (
                  <ActionGroup
                    status={entityStatus}
                    groupId={group.id}
                    onEditGroup={handleEditGroup}
                    onArchiveGroup={handleArchiveGroup}
                    onMoveToTrash={handleMoveToTrashGroup}
                    onRestoreGroup={handleRestoreGroup}
                    onDeleteGroup={handleDeleteGroup}
                  />
                )}
                <div onClick={() => toggleDropdown(group.id)} className="select-none">
                  <TitleGroup
                    groupId={group.id}
                    textColor={group.textColor}
                    title={group.title}
                    onEditGroup={handleEditGroup}
                  />
                </div>
                <Button
                  className="cursor-pointer"
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleDropdown(group.id)}
                  style={{ color: group.textColor }}
                >
                  <ChevronDown
                    className={cn(
                      "transition-all duration-300",
                      !isGroupOpen && "-rotate-90"
                    )}
                  />
                </Button>
              </div>

              <Collapsible
                open={isGroupOpen}
                style={{ borderColor: group.textColor }}
              >
                <CollapsibleContent>
                  <ItemLifecycleView
                    items={group.item}
                    textColor={group.textColor}
                    entityStatus={entityStatus}
                    {...commonProps}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
          );
        })}
      </div>
    </section>
  );
}