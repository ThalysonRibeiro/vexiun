"use client"
import { Button } from "@/components/ui/button";
import { ChevronDown, LayoutGrid, Logs, Plus } from "lucide-react";
import { useState } from "react";
import { GroupForm } from "./group-form";
import { ListItems } from "./list-items";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { GroupPriorityBar, GroupProgressBar } from "./group-progress-bar";
import { useGroupActions, useGroups } from "@/hooks/use-groups";
import { useTeam } from "@/hooks/use-team";
import { Badge } from "@/components/ui/badge";
import { TitleGroup } from "./group/title-group";
import { ActionGroup } from "./group/action-group";
import { NewItem } from "./group/new-item";

export function Groups({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const [changeLayout, setChangeLayout] = useState<boolean>(false);
  const [openDialogs, setOpenDialogs] = useState<Set<string>>(new Set());
  const { data: groups } = useGroups(workspaceId);
  const { data: team } = useTeam(workspaceId);

  const {
    isLoading,
    isAddingGroup,
    editingGroupId,
    openGroups,
    setIsAddingGroup,
    toggleDropdown,
    handleEditGroup,
    closeEditForm,
    closeAddGroupForm,
    handleDeleteGroup,
    handleMoveToTrash,
    handleArchiveGroup,
    handleRestoreGroup
  } = useGroupActions(workspaceId);

  return (
    <section className="space-y-6 mb-6">
      {groups?.group.length === 0 && <h2 className="text-center">Cadastre um group</h2>}
      {/* Botão/Formulário para adicionar novo grupo */}
      <div className="">
        {isAddingGroup ? (
          <GroupForm
            workspaceId={workspaceId}
            setAddGroup={closeAddGroupForm}
          />
        ) : (
          <div className="flex gap-4">
            <Button
              onClick={() => setIsAddingGroup(true)}
              variant="outline"
              className="cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Novo grupo
            </Button>

            <Button
              onClick={() => setChangeLayout(prev => !prev)}
              variant="outline"
              className="cursor-pointer"
            >
              {changeLayout ? <Logs /> : <LayoutGrid />}
              <span>Layout</span>
              {changeLayout ? "lista" : "grid"}
            </Button>
          </div>
        )}
      </div>
      {/* Lista de grupos */}
      <div className="space-y-6">
        {groups?.group.map(group => {
          const isGroupOpen = openGroups.has(group.id);

          return (
            <div key={group.id} className="space-y-4">

              <div className="flex items-center gap-3 mb-4 w-full">
                <ActionGroup
                  groupId={group.id}
                  onEditGroup={handleEditGroup}
                  onArchiveGroup={handleArchiveGroup}
                  onMoveToTrash={handleMoveToTrash}
                  onRestoreGroup={handleRestoreGroup}
                  onDeleteGroup={handleDeleteGroup}
                />
                {editingGroupId === group.id ? (
                  <GroupForm
                    workspaceId={workspaceId}
                    setAddGroup={closeEditForm}
                    groupId={group.id}
                    initialValues={{
                      title: group.title,
                      textColor: group.textColor
                    }}
                  />
                ) : (
                  <TitleGroup
                    groupId={group.id}
                    textColor={group.textColor}
                    title={group.title}
                    onEditGroup={handleEditGroup}
                  />
                )}
                <Badge
                  style={{ background: group.textColor }}
                >
                  {group.doneCount}/{group.pendingCount}
                </Badge>
                <Button
                  className="cursor-pointer"
                  variant="ghost" size="icon"
                  onClick={() => toggleDropdown(group.id)}
                  style={{ color: group.textColor }}
                >
                  <ChevronDown className={cn("transition-all duration-300 ", !isGroupOpen && "-rotate-90")} />
                </Button>

                {group?.item.length > 1 && (
                  <div className="w-full flex flex-col md:flex-row space-x-2 max-w-50 ml-auto">
                    <div className="w-full">
                      <span className="text-[10px]">Prioridade</span>
                      <GroupPriorityBar items={group.item} />
                    </div>
                    <div className="w-full">
                      <span className="text-[10px]">Status</span>
                      <GroupProgressBar items={group.item} />
                    </div>
                  </div>
                )}
              </div>

              <Collapsible
                className="ml-1 space-y-4 border-l pl-4"
                open={isGroupOpen}
                style={{ borderColor: group.textColor }}
              >
                <CollapsibleContent className="relative">
                  <ListItems
                    groupId={group.id}
                    team={team ?? []}
                    changeLayout={changeLayout}
                    workspaceId={workspaceId}
                  />
                  <NewItem
                    groupId={group.id}
                    team={team ?? []}
                    openDialogs={openDialogs}
                    setOpenDialogs={setOpenDialogs}
                  />
                </CollapsibleContent>
              </Collapsible>

            </div>
          );
        })}
      </div>
    </section >
  );
}