"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CalendarTerm } from "./calendar-term";
import { Textarea } from "@/components/ui/textarea";
import {
  colorComplexity,
  colorPriority,
  colorStatus,
  complexityMap,
  priorityMap,
  statusMap
} from "@/utils/colorStatus";
import { cn } from "@/lib/utils";
import { ItemFormData, updateItem } from "@/app/actions/item";
import { isErrorResponse, isSuccessResponse } from "@/lib/errors/error-handler";
import { DetailsEditor } from "./details-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/utils/name-fallback";
import { useSession } from "next-auth/react";
import { useCreateItem, UseItemForm, UseItemFormProps } from "@/hooks/use-items";
import { useParams } from "next/navigation";
import { useWorkspaceMemberData, useWorkspacePermissions } from "@/hooks/use-workspace";
import { EntityStatus, WorkspaceRole } from "@/generated/prisma";
import { TeamResponse } from "@/hooks/use-team";

interface CreateItemFormProps {
  workspaceId: string;
  closeForm: (value: boolean) => void;
  initialValues?: UseItemFormProps["initialValues"];
  groupId: string;
  itemId?: string;
  editingItem: boolean;
  team: TeamResponse;
}

export function CreateOrEditItemForm(props: CreateItemFormProps) {
  const { closeForm, initialValues, groupId, itemId, editingItem, team } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = UseItemForm({ initialValues });
  const { data: session } = useSession();
  const createItem = useCreateItem();

  const { id: workspaceId } = useParams();
  const { data: workspace } = useWorkspaceMemberData(workspaceId as string);

  const currentUserId = session?.user.id;
  const isOwner = workspace?.workspace.userId === currentUserId;
  const permissions = useWorkspacePermissions({
    userRole: (workspace?.member.role as WorkspaceRole) ?? "VIEWER",
    workspaceStatus: workspace?.workspace.status as EntityStatus,
    isOwner
  });

  async function onSubmit(formData: ItemFormData) {
    setIsLoading(true);

    if (editingItem && itemId) {
      const response = await updateItem({
        workspaceId: workspaceId as string,
        itemId: itemId,
        title: formData?.title,
        status: formData?.status,
        complexity: formData?.complexity,
        priority: formData?.priority,
        term: formData?.term,
        notes: formData?.notes,
        description: formData?.description,
        assignedTo: formData?.assignedTo ?? session?.user?.id,
        details: formData?.details,
        revalidatePaths: ["/dashboard/workspace"]
      });

      if (isErrorResponse(response)) {
        toast.error("Erro ao atualizar item");
      } else {
        toast.success("Item atualizado com sucesso!");
      }
      // closeForm(false);
      form.reset();
      setIsLoading(false);
      return;
    } else {
      const response = await createItem.mutateAsync({
        workspaceId: workspaceId as string,
        groupId: groupId,
        title: formData.title,
        priority: formData.priority,
        complexity: formData?.complexity,
        term: formData.term,
        notes: formData.notes,
        description: formData.description,
        status: "NOT_STARTED",
        assignedTo: formData.assignedTo ?? session?.user?.id,
        details: formData.details,
        revalidatePaths: ["/dashboard/workspace"]
      });
      if (!isSuccessResponse(response)) {
        toast.error("Erro ao cadastrar item");
        return;
      }
      toast.success("Item cadastrado com sucesso!");
      // closeForm(false);
      form.reset();
      setIsLoading(false);
      return;
    }
  }

  if (isLoading) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-t-accent rounded-full animate-spin border-primary" />
    );
  }

  return (
    <Form {...form}>
      <form
        className={cn(
          "grid grid-cols-1 gap-4 w-full",
          editingItem ? "lg:grid-cols-1" : "lg:grid-cols-2"
        )}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex-1 w-full">
          {permissions.canCreateOrEditItem && (
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Titulo</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      id="title"
                      placeholder="Digite o nome do item..."
                      aria-describedby="item-name-error"
                      aria-required="true"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {permissions.canCreateOrEditItem && (
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Notas adicionais para seu item"
                      className="max-h-25 w-full"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {permissions.canCreateOrEditItem && (
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex-1 w-full">
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Descreva seu item aqui..."
                      className="max-h-35 w-full"
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex flex-wrap items-center justify-between gap-4">
            {permissions.canCreateOrEditItem && (
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Prioridade</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className={cn("w-full cursor-pointer", colorPriority(field.value))}
                          size="sm"
                        >
                          <SelectValue>
                            {(() => {
                              const p = priorityMap.find((p) => p.key === field.value);
                              return p ? (
                                <div className="flex items-center gap-1.5">
                                  <p.icon className="h-3.5 w-3.5 text-white" />
                                  <span>{p.label}</span>
                                </div>
                              ) : null;
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="p-2">
                          {priorityMap.map((p) => (
                            <SelectItem
                              key={p.key}
                              value={p.key}
                              className={cn(
                                "cursor-pointer rounded-none mb-1",
                                colorPriority(p.key)
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <p.icon className="h-4 w-4 text-white" />
                                <span>{p.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {permissions.canCreateOrEditItem && (
              <FormField
                control={form.control}
                name="complexity"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Complexidade</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className={cn("w-full cursor-pointer", colorComplexity(field.value))}
                          size="sm"
                        >
                          <SelectValue>
                            {(() => {
                              const p = complexityMap.find((p) => p.key === field.value);
                              return p ? (
                                <div className="flex items-center gap-1.5">
                                  <p.icon className="h-3.5 w-3.5 text-white" />
                                  <span>{p.label}</span>
                                </div>
                              ) : null;
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="p-2">
                          {complexityMap.map((p) => (
                            <SelectItem
                              key={p.key}
                              value={p.key}
                              className={cn(
                                "cursor-pointer rounded-none mb-1",
                                colorComplexity(p.key)
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <p.icon className="h-4 w-4 text-white" />
                                <span>{p.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {editingItem && permissions.canCreateOrEditItem && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className={cn("w-full cursor-pointer", colorStatus(field.value))}
                          size="sm"
                        >
                          <SelectValue>
                            {(() => {
                              const s = statusMap.find((s) => s.key === field.value);
                              return s ? (
                                <div className="flex items-center gap-1.5">
                                  <s.icon
                                    className={cn(
                                      "h-3.5 w-3.5 text-white",
                                      s.animate && "animate-spin"
                                    )}
                                  />
                                  <span className="text-white">{s.label}</span>
                                </div>
                              ) : null;
                            })()}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="p-2">
                          {statusMap.map((s) => (
                            <SelectItem
                              key={s.key}
                              value={s.key}
                              className={cn("cursor-pointer rounded-none mb-1", colorStatus(s.key))}
                            >
                              <div className="flex items-center gap-2">
                                <s.icon
                                  className={cn("h-4 w-4 text-white", s.animate && "animate-spin")}
                                />
                                <span>{s.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {permissions.canCreateOrEditItem && (
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo</FormLabel>
                    <FormControl>
                      <CalendarTerm
                        onChange={(date) => {
                          field.onChange(date);
                        }}
                        initialDate={initialValues?.term} // Adiciona esta linha
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {team && permissions.canEdit && (
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => {
                const selectedTeam = team.find((t) => t.user.id === field.value) ?? team[0];
                return (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value ?? undefined}>
                        <SelectTrigger className="flex items-center gap-2 w-full">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={selectedTeam.user.image ?? undefined} />
                              <AvatarFallback>
                                {nameFallback(selectedTeam.user.name ?? undefined)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{selectedTeam.user.name}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {team.map((member) => (
                            <SelectItem key={member.user.id} value={member.user.id}>
                              <Avatar>
                                <AvatarImage src={member.user.image ?? undefined} />
                                <AvatarFallback>
                                  {nameFallback(member.user.name ?? undefined)}
                                </AvatarFallback>
                              </Avatar>
                              <span>{member.user.name?.split(" ")[0]}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          )}
        </div>

        {permissions.canCreateOrEditItem && (
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Detalhes</FormLabel>
                  <FormControl>
                    <div className="h-full min-h-80 max-h-80">
                      <DetailsEditor
                        content={
                          field.value && Object.keys(field.value).length ? field.value : null
                        }
                        onContentChange={field.onChange}
                      />
                    </div>
                  </FormControl>
                </FormItem>
              );
            }}
          />
        )}
        <Button type="submit" className={cn("mt-3.5 w-fit px-10")}>
          {editingItem ? "Salvar" : "Cadastrar"}
        </Button>
      </form>
    </Form>
  );
}
