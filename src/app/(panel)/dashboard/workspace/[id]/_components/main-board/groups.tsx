"use client"
import { Button } from "@/components/ui/button";
import { Archive, ChevronDown, Edit, Ellipsis, LayoutGrid, Logs, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { GroupForm } from "./group-form";
import { toast } from "sonner";
import { CreateOrEditItemForm } from "./create-or-edit-item-form";
import { ListItems } from "./list-items";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { GroupPriorityBar, GroupProgressBar } from "./group-progress-bar";
import { useDeleteGroup, useGroups } from "@/hooks/use-groups";
import { useTeam } from "@/hooks/use-team";
import { Badge } from "@/components/ui/badge";

export function Groups({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const [changeLayout, setChangeLayout] = useState<boolean>(false);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const [openDialogs, setOpenDialogs] = useState<Set<string>>(new Set());
  const { data: groups } = useGroups(workspaceId);
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
      await deleteGroup.mutateAsync({
        groupId: id,
        revalidatePaths: [`/dashboard/workspace/${workspaceId}`]
      });
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
    <section className="space-y-6 mb-6">
      {groups?.group.length === 0 && <h2 className="text-center">Cadastre um group</h2>}
      {/* Botão/Formulário para adicionar novo grupo */}
      <div className="pt-4 border-t border-gray-200">
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

              {/* Cabeçalho do grupo */}
              <div className="flex items-center gap-3 mb-4 w-full">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
                      <Ellipsis />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel> Opções</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Archive /> Arquivar
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => handleEditGroup(group.id)}
                    >
                      <Edit /> Editar nome
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteGroup(group.id)}
                      variant="destructive"
                    >
                      <Trash /> Deletar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
                  <ChevronDown className={cn("transition-all duration-300 ", isGroupOpen && "-rotate-90")} />
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

              {/* Conteúdo do grupo */}
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
                        size="sm"
                        className={cn("mt-4",)}
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

            </div>
          );
        })}
      </div>
    </section >
  );
}