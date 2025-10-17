"use client"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ItemFormData, UseItemForm, UseItemFormProps } from "./use-item-form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CalendarTerm } from "./calendar-term";
import { Textarea } from "@/components/ui/textarea";
import { colorPriority, colorStatus, priorityMap, statusMap } from "@/utils/colorStatus";
import { cn } from "@/lib/utils";
import { updateItem } from "@/app/actions/item";
import { isErrorResponse, isSuccessResponse } from "@/lib/errors/error-handler";
import { DetailsEditor } from "./details-editor";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/utils/name-fallback";
import { useSession } from "next-auth/react";
import { useCreateItem } from "@/hooks/use-items";

interface CreateItemFormProps {
  closeForm: (value: boolean) => void;
  initialValues?: UseItemFormProps['initialValues'];
  groupId: string;
  itemId?: string;
  editingItem: boolean;
  team: TeamUser[];
}

type TeamUser = {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
}

export function CreateOrEditItemForm({
  closeForm, initialValues, groupId, itemId, editingItem, team
}: CreateItemFormProps
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const form = UseItemForm({ initialValues });
  const { data: session } = useSession();
  const createItem = useCreateItem();

  async function onSubmit(formData: ItemFormData) {
    setIsLoading(true);

    if (editingItem && itemId) {
      const response = await updateItem({
        itemId: itemId,
        title: formData?.title,
        status: formData?.status,
        term: formData?.term,
        priority: formData?.priority,
        notes: formData?.notes,
        description: formData?.description,
        assignedTo: formData?.assignedTo ?? session?.user?.id,
        details: formData?.details,
      });

      if (isErrorResponse(response)) {
        toast.error("Erro ao atualizar item");
      } else {
        ;
        toast.success("Item atualizado com sucesso!");
      }
      closeForm(false);
      form.reset();
      setIsLoading(false);
      return;

    } else {
      const response = await createItem.mutateAsync({
        groupId: groupId,
        title: formData.title,
        term: formData.term,
        priority: formData.priority,
        notes: formData.notes,
        description: formData.description,
        status: "NOT_STARTED",
        assignedTo: formData.assignedTo ?? session?.user?.id,
        details: formData.details,
      });
      if (!isSuccessResponse(response)) {
        toast.error("Erro ao cadastrar item");
        return;
      }
      toast.success("Item cadastrado com sucesso!");
      closeForm(false);
      form.reset();
      setIsLoading(false);
      return;
    }
  }

  if (isLoading) {
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-t-accent rounded-full animate-spin border-primary" />
    )
  }

  return (
    <Form {...form}>
      <form className={cn("grid grid-cols-1 gap-4 w-full",
        editingItem ? "lg:grid-cols-1" : "lg:grid-cols-2"
      )}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex-1 w-full">
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

          <div className="flex flex-wrap items-center justify-between gap-4">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Prioridade</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className={cn("w-full", colorPriority(field.value))} size="sm">
                        <SelectValue placeholder={priorityMap["STANDARD"]} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRITICAL" className={colorPriority("CRITICAL")}>Crítico</SelectItem>
                        <SelectItem value="HIGH" className={colorPriority("HIGH")}>Alto</SelectItem>
                        <SelectItem value="MEDIUM" className={colorPriority("MEDIUM")}>Medio</SelectItem>
                        <SelectItem value="LOW" className={colorPriority("LOW")}>Baixo</SelectItem>
                        <SelectItem value="STANDARD" className={colorPriority("STANDARD")}>Padrão</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />

            {editingItem && (
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className={colorStatus(field.value)} size="sm" >
                          <SelectValue placeholder={statusMap[field.value]} />
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
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prazo</FormLabel>
                  <FormControl>
                    <CalendarTerm
                      onChange={(date) => {
                        field.onChange(date)
                      }}
                      initialDate={field.value || new Date()} // Adiciona esta linha
                    />
                  </FormControl>
                  <FormDescription />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {team && (
            <FormField
              control={form.control}
              name="assignedTo"
              render={({ field }) => {
                const selectedTeam = team.find(t => t.id === field.value) ?? team[0]
                return (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? undefined}
                      >
                        <SelectTrigger className="flex items-center gap-2 w-full">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={selectedTeam.image ?? undefined} />
                              <AvatarFallback>{nameFallback(selectedTeam.name ?? undefined)}</AvatarFallback>
                            </Avatar>
                            <span>{selectedTeam.name}</span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {team.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              <Avatar>
                                <AvatarImage src={user.image ?? undefined} />
                                <AvatarFallback>{nameFallback(user.name ?? undefined)}</AvatarFallback>
                              </Avatar>
                              <span>{user.name?.split(" ")[0]}</span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )
              }}
            />
          )}
        </div>


        <FormField
          control={form.control}
          name="details"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  Detalhes
                </FormLabel>
                <FormControl>
                  <div className="h-full min-h-80 max-h-80">
                    <DetailsEditor
                      content={field.value ?? {}}
                      onContentChange={field.onChange}
                    />
                  </div>
                </FormControl>
              </FormItem>
            )
          }}
        />
        <Button type="submit" className={cn("mt-3.5 w-fit px-10")}>
          {editingItem ? 'Salvar' : 'Cadastrar'}
        </Button>
      </form>
    </Form>
  )
}