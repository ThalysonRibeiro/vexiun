"use client"

import { useGroupActions, useGroupItemByEntityStatus } from "@/hooks/use-groups";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArchiveRestore, ChevronDown, LayoutGrid, Logs, Trash } from "lucide-react";
import { useItemActions } from "@/hooks/use-items";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { ActionGroup } from "./main-board/group/action-group";
import { TitleGroup } from "./main-board/group/title-group";
import { ItemLifecycleView } from "./main-board/items/item-lifecycle-view";
import { EmptyState } from "../../_components/empty-state";
import { Banner } from "@/components/ui/banner";

type EntityStatus = "ARCHIVED" | "DELETED";

interface ItemLifecycleManagerProps {
  workspaceId: string;
  entityStatus: EntityStatus;
}

export function ItemLifecycleManager({
  workspaceId,
  entityStatus
}: ItemLifecycleManagerProps) {
  const [changeLayout, setChangeLayout] = useState<boolean>(false);
  const { data } = useGroupItemByEntityStatus(workspaceId, entityStatus);

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

  const layoutLabel = entityStatus === "ARCHIVED" ? "Arquivados" : "Lixeira";

  if (data?.length === 0) {

  }

  return (
    <section>
      {entityStatus === "DELETED" && (
        <Banner
          icon={Trash}
          title="Atenção"
          description="Grupos e items na lixeira serão deletados permanentemente em 30 dias. Restaure-os antes disso para não perder seus dados."
          variant="destructive"
        />
      )}
      {data?.length === 0 ? (
        <EmptyState
          icon={entityStatus === "ARCHIVED" ? ArchiveRestore : Trash}
          title={
            entityStatus === "ARCHIVED"
              ? "Grupos e items arquivados"
              : "A lixeira está vazia"
          }
          description={
            entityStatus === "ARCHIVED"
              ? "Nenhum grupo ou item foi arquivado ainda."
              : "Grupos e items deletados aparecerão aqui por 30 dias."
          }
        />
      ) : (
        <div>
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
                    <ActionGroup
                      groupId={group.id}
                      onEditGroup={handleEditGroup}
                      onArchiveGroup={handleArchiveGroup}
                      onMoveToTrash={handleMoveToTrashGroup}
                      onRestoreGroup={handleRestoreGroup}
                      onDeleteGroup={handleDeleteGroup}
                    />
                    <TitleGroup
                      groupId={group.id}
                      textColor={group.textColor}
                      title={group.title}
                      onEditGroup={handleEditGroup}
                    />
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
        </div>
      )}
    </section>
  );
}