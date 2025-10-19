"use client"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Priority, Status } from "@/generated/prisma";
import { format } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { colorPriority, colorStatus, priorityMap, statusMap } from "@/utils/colorStatus";
import { Trash, Check, X, CircleAlert, MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarTerm } from "./calendar-term";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { InfoItem } from "./info-item";
import { usePagination } from "@/hooks/use-pagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { DetailsEditor } from "./details-editor";
import { JSONContent } from "@tiptap/core";
import { nameFallback } from "@/utils/name-fallback";
import { ItemWhitCreatedAssignedUser, useDeleteItem, useItems, useUpdateItem } from "@/hooks/use-items";
import { ItemAssign } from "../item-assign";

interface ItemsTablesProps {
  groupId: string
  team: TeamUser[];
}

type TeamUser = {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
}

type EditingField = 'title' | 'notes' | 'description' | 'term' | null;

interface EditingState {
  itemId: string | null;
  field: EditingField;
}

interface DialogStateProps {
  isOpen: boolean;
  itemId: string | null;
  isEditing: boolean;
  content: JSONContent | null;
}

export function ItemsTables({ groupId, team }: ItemsTablesProps) {
  const [dialogMenber, setDialogMenber] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<DialogStateProps>({
    isOpen: false,
    itemId: null,
    isEditing: false,
    content: null
  });
  const [editing, setEditing] = useState<EditingState>({ itemId: null, field: null });
  const [editingData, setEditingData] = useState<ItemWhitCreatedAssignedUser | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const { data: items, isLoading: isLoadingItems, error } = useItems(groupId);
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();


  const pagination = usePagination(items?.itemsNotCompleted ?? [], 10);
  const currentItems = pagination.currentItems;

  const isEditing = (itemId: string, field: EditingField) =>
    editing.itemId === itemId && editing.field === field;

  const startEditing = useCallback((item: ItemWhitCreatedAssignedUser, field: EditingField) => {
    setEditing({ itemId: item.id, field });
    setEditingData({ ...item });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditing({ itemId: null, field: null });
    setEditingData(null);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        const isPopoverClick = (event.target as Element).closest('[data-radix-popper-content-wrapper]');
        if (!isPopoverClick) {
          cancelEditing();
        }
      }
    }

    if (editing.itemId) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editing.itemId, cancelEditing]);

  const handleSaveDetails = async (item: ItemWhitCreatedAssignedUser) => {
    if (!dialogState.content) return;

    setIsLoading(item.id);

    const result = await updateItem.mutateAsync({
      itemId: item.id,
      title: item.title,
      status: item.status,
      term: item.term,
      priority: item.priority,
      notes: item.notes,
      description: item.description,
      details: dialogState.content,
      assignedTo: item.assignedTo
    });

    if (!isSuccessResponse(result)) {
      toast.error("Erro ao atualizar detalhes");
    }

    toast.success("Detalhes atualizados com sucesso!");
    setDialogState({ isOpen: false, itemId: null, isEditing: false, content: null });
    setIsLoading(null);
  }

  const handleSaveField = useCallback(async (item: ItemWhitCreatedAssignedUser) => {
    if (!editingData) return;

    setIsLoading(item.id);

    const response = await updateItem.mutateAsync({
      itemId: item.id,
      title: editingData.title,
      status: editingData.status,
      term: editingData.term,
      priority: editingData.priority,
      notes: editingData.notes,
      description: editingData.description
    });

    if (!isSuccessResponse(response)) {
      toast.error("Erro ao atualizar item");
    }
    toast.success("Item atualizado com sucesso!");
    cancelEditing();
    setIsLoading(null);

  }, [editingData, cancelEditing, updateItem]);

  const handleSelectChange = useCallback(async (
    item: ItemWhitCreatedAssignedUser,
    field: 'priority' | 'status',
    value: Priority | Status
  ) => {
    setIsLoading(item.id);

    const response = await updateItem.mutateAsync({
      itemId: item.id,
      title: item.title,
      status: field === 'status' ? value as Status : item.status,
      term: item.term,
      priority: field === 'priority' ? value as Priority : item.priority,
      notes: item.notes,
      description: item.description,
      details: item.details as JSONContent
    });

    if (!isSuccessResponse(response)) {
      toast.error("Erro ao atualizar item");
    }
    toast.success("Item atualizado!");
    setIsLoading(null);

  }, [updateItem]);

  const handleDeleteItem = useCallback(async (itemId: string) => {
    setIsLoading(itemId);

    if (!confirm('Deseja realmente deletar o item?, todos os dados serão deletados junto')) {
      return;
    }
    const response = await deleteItem.mutateAsync({ itemId });
    if (!isSuccessResponse(response)) {
      toast.error("Erro ao cadastrar item");
      return;
    }
    toast.success("Item deletado com sucesso!");
    setIsLoading(null);

  }, [deleteItem]);

  const renderEditableCell = (
    item: ItemWhitCreatedAssignedUser,
    field: EditingField,
    value: string | null
  ) => {
    if (isEditing(item.id, field) && field) {
      const fieldValue = editingData?.[field] as string || '';

      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveField(item);
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={fieldValue}
            onChange={(e) => setEditingData((prev: ItemWhitCreatedAssignedUser | null) =>
              prev ? { ...prev, [field]: e.target.value } : null
            )}
            onKeyDown={(e) => {
              if (e.key === 'Escape') cancelEditing();
              if (e.key === 'Enter') handleSaveField(item);
            }}
            autoFocus
            disabled={isLoading === item.id}
            className="flex-1"
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            disabled={isLoading === item.id}
            className="text-green-600 hover:text-green-700"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={cancelEditing}
            disabled={isLoading === item.id}
            className="text-red-600 hover:text-red-700"
          >
            <X className="h-4 w-4" />
          </Button>
        </form>
      );
    }

    return (
      <div
        onClick={() => startEditing(item, field)}
        className="cursor-pointer hover:bg-accent p-1 rounded transition-colors overflow-auto"
        title="Clique para editar"
      >
        <p className="overflow-hidden max-w-75 text-ellipsis truncate" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: '1.4em',
          maxHeight: '2.8em'
        }}>
          {value || 'Clique para editar'}
        </p>
      </div>
    );
  };

  if (isLoading || isLoadingItems) {
    return <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-t-accent rounded-full animate-spin border-primary">
    </div>
  }

  if (items?.itemsNotCompleted.length === 0) {
    return (
      <div className="text-center py-8">
        Ainda não há itens cadastrados.
      </div>
    );
  }

  return (
    <div ref={formRef} className="w-full space-y-4">
      <div className="w-full overflow-x-scroll border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titulo</TableHead>
              <TableHead className="border-l">Notas</TableHead>
              <TableHead className="max-w-25 overflow-hidden border-x text-center">Responsável</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead className="border-x">Prazo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center border-l">Descrição</TableHead>
              <TableHead className="text-center border-l">Detalhes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map(item => {
              const titleCapitalized = item.title[0].toUpperCase() + item.title.slice(1);
              return (
                <TableRow key={item.id} className={isLoading === item.id ? 'opacity-50' : ''}>
                  <TableCell>
                    <div className="flex items-center justify-between min-w-30 w-full">
                      {renderEditableCell(item, 'title', titleCapitalized)}
                      <DropdownMenu>
                        <DropdownMenuTrigger className="cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="space-y-1">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <Sheet>
                            <DropdownMenuItem
                              asChild
                              onSelect={(e) => e.preventDefault()}
                            >
                              <SheetTrigger className="flex items-center gap-2 cursor-pointer w-full">
                                <Eye className="h-4 w-4" /> Visualizar
                              </SheetTrigger>
                            </DropdownMenuItem>
                            <InfoItem data={item} team={team} />
                          </Sheet>
                          <DropdownMenuItem
                            variant="destructive"
                            disabled={isLoading === item.id}
                            onClick={() => handleDeleteItem(item.id)}
                            className="cursor-pointer"
                          >
                            <Trash className="h-4 w-4" /> Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-90 border-l">
                    <div className="overflow-hidden">
                      {isEditing(item.id, 'notes') ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveField(item);
                          }}
                          className="flex items-start gap-2"
                        >
                          <div className="flex-1 space-y-2">
                            <Textarea
                              value={editingData?.notes || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 1000) {
                                  setEditingData((prev: ItemWhitCreatedAssignedUser | null) =>
                                    prev ? { ...prev, notes: value } : null
                                  );
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') cancelEditing();
                                if (e.key === 'Enter' && e.ctrlKey) handleSaveField(item);
                              }}
                              autoFocus
                              disabled={isLoading === item.id}
                              className="max-h-[120px] w-full"
                              placeholder="Digite as notas..."
                              maxLength={1000}
                            />
                            <div className="flex justify-end">
                              <span className={cn(
                                "text-xs",
                                (editingData?.notes || '').length > 900 && "text-red-500",
                                (editingData?.notes || '').length > 800 && (editingData?.notes || '').length <= 900 && "text-yellow-500",
                                (editingData?.notes || '').length <= 800 && "text-gray-500"
                              )}>
                                {(editingData?.notes || '').length}/1000
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              type="submit"
                              size="sm"
                              variant="ghost"
                              disabled={isLoading === item.id}
                              className="text-green-600 hover:text-green-700"
                              title="Salvar (Ctrl + Enter)"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={cancelEditing}
                              disabled={isLoading === item.id}
                              className="text-red-600 hover:text-red-700"
                              title="Cancelar (Esc)"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div
                          onClick={() => startEditing(item, 'notes')}
                          className="cursor-pointer hover:bg-accent p-1 rounded transition-colors group"
                          title="Clique para editar"
                        >
                          {item.notes ? (
                            <p className="overflow-hidden text-ellipsis" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: '1.4em',
                              maxHeight: '2.8em'
                            }}>
                              {item.notes}
                            </p>
                          ) : (
                            <span className="text-gray-400 italic">
                              Clique para adicionar notas
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="border-x" title="Para trocar de responsável edite o item">
                    <Dialog>
                      <DialogTrigger
                        className="cursor-pointer"
                        title="Clique pra designar um membro da equipe"
                      >
                        <div className="flex items-center gap-2 h-full w-full">
                          <Avatar>
                            <AvatarImage src={item.assignedToUser?.image as string} />
                            <AvatarFallback>
                              {nameFallback(item.assignedToUser?.name as string)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{item.assignedToUser?.name?.split(" ")[0] ?? "CATALYST"}</span>
                        </div>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Membros da equipe
                          </DialogTitle>
                          <DialogDescription>
                            Selecione um membro da equipe que será responsável por esteo item
                          </DialogDescription>
                        </DialogHeader>
                        <ItemAssign
                          itemId={item.id}
                          assignedToUser={item.assignedToUser}
                        />
                      </DialogContent>
                    </Dialog>


                  </TableCell>

                  <TableCell className={colorPriority(item.priority)}>
                    <Select
                      onValueChange={(value) => handleSelectChange(item, 'priority', value as Priority)}
                      disabled={isLoading === item.id}
                    >
                      <SelectTrigger className={cn("w-full p-0 border-0 shadow-none",
                        colorPriority(item.priority))} size="sm"
                      >
                        <SelectValue placeholder={priorityMap[item.priority]} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRITICAL" className={colorPriority("CRITICAL")}>
                          CRÍTICO
                        </SelectItem>
                        <SelectItem value="HIGH" className={colorPriority("HIGH")}>
                          ALTO
                        </SelectItem>
                        <SelectItem value="MEDIUM" className={colorPriority("MEDIUM")}>
                          MÉDIO
                        </SelectItem>
                        <SelectItem value="LOW" className={colorPriority("LOW")}>
                          BAIXO
                        </SelectItem>
                        <SelectItem value="STANDARD" className={colorPriority("STANDARD")}>
                          PADRÃO
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="border-x">
                    {isEditing(item.id, 'term') ? (
                      <div className="flex items-center gap-2">
                        <CalendarTerm
                          initialDate={editingData?.term || item.term}
                          onChange={(dateRange) => {
                            setEditingData((prev: ItemWhitCreatedAssignedUser | null) =>
                              prev ? { ...prev, term: dateRange } : null);
                          }}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSaveField(item)}
                          disabled={isLoading === item.id}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={cancelEditing}
                          disabled={isLoading === item.id}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {new Date(item.term) < new Date() && (
                          <div className="flex items-center gap-1">
                            {item.status === 'DONE' ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <CircleAlert className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        )}
                        <div
                          onClick={() => startEditing(item, 'term')}
                          className={cn(
                            "cursor-pointer hover:bg-accent p-1 rounded transition-colors",
                            new Date(item.term) < new Date() && item.status !== 'DONE' && "text-red-600 font-semibold"
                          )}
                          title="Clique para editar"
                        >
                          {format(item.term, "dd/MM/yyyy")}
                        </div>
                      </div>
                    )}
                  </TableCell>

                  <TableCell className={colorStatus(item.status)}>
                    <Select
                      onValueChange={(value) => handleSelectChange(item, 'status', value as Status)}
                      disabled={isLoading === item.id}
                    >
                      <SelectTrigger className={cn("w-full p-0 border-0 shadow-none",
                        colorStatus(item.status))} size="sm">
                        <SelectValue placeholder={statusMap[item.status]} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DONE" className={colorStatus("DONE")}>
                          CONCLUÍDO
                        </SelectItem>
                        <SelectItem value="IN_PROGRESS" className={colorStatus("IN_PROGRESS")}>
                          EM ANDAMENTO
                        </SelectItem>
                        <SelectItem value="STOPPED" className={colorStatus("STOPPED")}>
                          INTERROMPIDO
                        </SelectItem>
                        <SelectItem value="NOT_STARTED" className={colorStatus("NOT_STARTED")}>
                          NÃO INICIADO
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell className="max-w-90 border-l">
                    <div className="overflow-hidden">
                      {isEditing(item.id, 'description') ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSaveField(item);
                          }}
                          className="flex items-start gap-2"
                        >
                          <div className="flex-1 space-y-2">
                            <Textarea
                              value={editingData?.description || ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value.length <= 1000) {
                                  setEditingData((prev: ItemWhitCreatedAssignedUser | null) =>
                                    prev ? { ...prev, description: value } : null
                                  );
                                }
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Escape') cancelEditing();
                                if (e.key === 'Enter' && e.ctrlKey) handleSaveField(item);
                              }}
                              autoFocus
                              disabled={isLoading === item.id}
                              className="max-h-[120px] w-full"
                              placeholder="Digite a descrição..."
                              maxLength={1000}
                            />
                            <div className="flex justify-end">
                              <span className={cn(
                                "text-xs",
                                (editingData?.description || '').length > 900 && "text-red-500",
                                (editingData?.description || '').length > 800 && (editingData?.description || '').length <= 900 && "text-yellow-500",
                                (editingData?.description || '').length <= 800 && "text-gray-500"
                              )}>
                                {(editingData?.description || '').length}/1000
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              type="submit"
                              size="sm"
                              variant="ghost"
                              disabled={isLoading === item.id}
                              className="text-green-600 hover:text-green-700"
                              title="Salvar (Ctrl + Enter)"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={cancelEditing}
                              disabled={isLoading === item.id}
                              className="text-red-600 hover:text-red-700"
                              title="Cancelar (Esc)"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <div
                          onClick={() => startEditing(item, 'description')}
                          className="cursor-pointer hover:bg-accent p-1 rounded transition-colors group"
                          title="Clique para editar"
                        >
                          {item.description ? (
                            <p className="overflow-hidden text-ellipsis" style={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              lineHeight: '1.4em',
                              maxHeight: '2.8em'
                            }}>
                              {item.description}
                            </p>
                          ) : (
                            <span className="text-gray-400 italic">
                              Clique para adicionar descrição
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="border-l">
                    <div className="flex items-center justify-center">
                      <Dialog
                        open={dialogState.isOpen && dialogState.itemId === item.id}
                        onOpenChange={(open) => {
                          if (open) {
                            setDialogState({
                              isOpen: true,
                              itemId: item.id,
                              isEditing: false,
                              content: (item.details as JSONContent) ?? {}
                            });
                          } else {
                            setDialogState({ isOpen: false, itemId: null, isEditing: false, content: null });
                          }
                        }}
                      >
                        <DialogTrigger className="cursor-pointer flex items-center gap-2 hover:bg-accent p-1 rounded transition-colors group">
                          <Eye className="h-4 w-4" /> Visualizar
                        </DialogTrigger>
                        <DialogContent
                          className="min-h-50 max-h-[calc(100dvh-3rem)] min-w-[calc(100dvw-20rem)] overflow-hidden"
                        >
                          <DialogHeader>
                            <DialogTitle>Detalhes do item</DialogTitle>
                            <DialogDescription>
                              {dialogState.isEditing
                                ? "Editando detalhes - suas alterações não foram salvas"
                                : `Visualizando detalhes de ${item.title || 'item'}`}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="pb-6 w-full overflow-y-scroll min-h-50 max-h-120">
                            <DetailsEditor
                              autofocus={true}
                              editable={dialogState.isEditing}
                              content={dialogState.content ?? {}}
                              onContentChange={(newContent) => {
                                setDialogState(prev => ({ ...prev, content: newContent }));
                              }}
                            />
                          </div>
                          <div className="flex justify-end gap-2 border-t pt-4">
                            {!dialogState.isEditing ? (
                              <Button onClick={() => setDialogState(prev => ({ ...prev, isEditing: true }))}>
                                Editar
                              </Button>
                            ) : (
                              <>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setDialogState(prev => ({
                                      ...prev,
                                      isEditing: false,
                                      content: (item.details as JSONContent) ?? {}
                                    }));
                                  }}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  onClick={() => handleSaveDetails(item)}
                                  disabled={isLoading === item.id}
                                >
                                  Salvar
                                </Button>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {(items?.itemsNotCompleted ?? []).length > 10 && (
        <PaginationControls {...pagination} />
      )}
    </div>
  );
}