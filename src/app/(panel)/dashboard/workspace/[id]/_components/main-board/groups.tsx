"use client"
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { GroupForm } from "./group-form";
import { toast } from "sonner";
import { CreateOrEditItemForm } from "./create-or-edit-item-form";
import { ItemsTables } from "./items-tables";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { GroupProgressBar } from "./group-progress-bar";
import { CompletedItems } from "./completed-items";
import { GroupsData, useDeleteGroup } from "@/hooks/use-groups";
import { useTeam } from "@/hooks/use-team";

export function Groups({
  data, workspaceId,
}: {
  data: GroupsData, workspaceId: string;
}) {
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [openDialogs, setOpenDialogs] = useState<Set<string>>(new Set());
  const { data: team, isLoading: isLoadingTeam, error: errorTeam } = useTeam(workspaceId);
  const deleteGroup = useDeleteGroup();

  const toggleDropdown = (groupId: string) => {
    setOpenGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  function handleEditGroup(groupId: string) {
    setEditingGroupId(groupId);
  }

  function closeEditForm(value: boolean) {
    if (!value) {
      setEditingGroupId(null);
    }
    return value;
  }

  function closeAddGroupForm(value: boolean) {
    setIsAddingGroup(value);
    return value;
  }

  async function handleDeleteGroup(id: string) {
    try {
      if (!confirm('Deseja realmente deletar o grupo? todos os itens serão deletados junto')) {
        return;
      }
      await deleteGroup.mutateAsync({ groupId: id });
      toast.success("Grupo deletado com sucesso!");
      setOpenGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    } catch (error) {
      toast.error("Erro ao deletar grupo");
    }
  }

  return (
    <div className="space-y-6 mb-6">
      {data?.group.length === 0 && <h2>Cadastre um grupo</h2>}
      {/* Botão/Formulário para adicionar novo grupo */}
      <div className="pt-4 border-t border-gray-200">
        {isAddingGroup ? (
          <GroupForm
            workspaceId={workspaceId}
            setAddGroup={closeAddGroupForm}
          />
        ) : (
          <Button
            onClick={() => setIsAddingGroup(true)}
            variant="outline"
            className="border-dashed text-gray-600 hover:text-green-600 hover:border-green-300 cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo grupo
          </Button>
        )}
      </div>
      {/* Lista de grupos */}
      <div className="space-y-6">
        {data?.group.map(group => {
          const isGroupOpen = openGroups.has(group.id);

          return (
            <div key={group.id} className="space-y-4">
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
                <>
                  {/* Cabeçalho do grupo */}
                  <div className="flex items-center gap-3 mb-4 w-full">
                    <h2
                      className="font-bold cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ color: group.textColor }}
                      onClick={() => handleEditGroup(group.id)}
                      title="Clique para editar"
                    >
                      <span className="capitalize">
                        {group.title[0]}
                      </span>
                      {group.title.slice(1)}
                    </h2>
                    <span
                      className="text-sm font-normal"
                      style={{ color: group.textColor }}
                    >
                      ({group.doneCount}/{group.pendingCount})
                    </span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="cursor-pointer border-dashed text-gray-600 hover:text-red-600 hover:border-red-300"
                      onClick={() => handleDeleteGroup(group.id)}
                      title="Deletar grupo"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <button onClick={() => toggleDropdown(group.id)}>
                      <ChevronDown className={cn("cursor-pointer transition-all duration-300", isGroupOpen && "-rotate-90")} />
                    </button>
                    <div className="w-full max-w-40 ml-auto">
                      <GroupProgressBar items={group.item} />
                    </div>
                  </div>

                  {/* Conteúdo do grupo */}
                  <Collapsible
                    className="ml-6 space-y-4 border-l pl-4"
                    open={isGroupOpen}
                    style={{ borderColor: group.textColor }}
                  >
                    <CollapsibleContent>
                      <ItemsTables groupId={group.id} team={team ?? []} />

                      <Dialog
                        open={openDialogs.has(group.id)}
                        onOpenChange={(open) => {
                          setOpenDialogs(prev => {
                            const newSet = new Set(prev);
                            if (open) {
                              newSet.add(group.id);
                            } else {
                              newSet.delete(group.id);
                            }
                            return newSet;
                          });
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="border-dashed text-gray-600 hover:text-blue-600 hover:border-blue-300 cursor-pointer mt-3"
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Novo item
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="min-h-[400px] max-h-[calc(100dvh-3rem)] min-w-[calc(100dvw-20rem)] overflow-y-scroll">
                          <DialogHeader>
                            <DialogTitle>Cadastrar novo item</DialogTitle>
                          </DialogHeader>
                          <CreateOrEditItemForm
                            groupId={group.id}
                            closeForm={() => {
                              setOpenDialogs(prev => {
                                const newSet = new Set(prev);
                                newSet.delete(group.id);
                                return newSet;
                              });
                            }}
                            editingItem={false}
                            team={team ?? []}
                          />
                        </DialogContent>
                      </Dialog>

                    </CollapsibleContent>
                  </Collapsible>
                </>
              )}
            </div>
          );
        })}
      </div>
      <CompletedItems />
    </div >
  );
}