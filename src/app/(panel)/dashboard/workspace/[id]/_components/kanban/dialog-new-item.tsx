"use client"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { ItemFormData, UseItemForm } from "../main-board/use-item-form";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarTerm } from "../main-board/calendar-term";
import { Priority, Status } from "@/generated/prisma";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { useGroups } from "@/hooks/use-groups";
import { useParams } from "next/navigation";
import { useCreateItem, useInvalidateItems } from "@/hooks/use-items";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { nameFallback } from "@/utils/name-fallback";
import { DetailsEditor } from "../main-board/details-editor";
import { useTeam } from "@/hooks/use-team";
import { colorPriority, priorityMap } from "@/utils/colorStatus";
import { cn } from "@/lib/utils";

interface DialogContentNewItemProps {
  closeDialog: (value: boolean) => void;
  initialValues?: {
    title: string;
    term: Date;
    priority: Priority;
    status: Status;
    notes: string;
    description: string;
  }
  status: Status;
}

export function DialogContentNewItem({ closeDialog, initialValues, status }: DialogContentNewItemProps) {
  const params = useParams();
  const workspaceId = params.id as string;
  const { data: session } = useSession();
  const { data, isLoading, error } = useGroups(workspaceId);
  const { data: team } = useTeam(workspaceId);
  const form = UseItemForm({ initialValues });
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const createItem = useCreateItem();
  const invalidateItems = useInvalidateItems();

  async function onSubmit(formData: ItemFormData) {
    try {
      const response = await createItem.mutateAsync({
        groupId: selectedGroupId || data?.group[0].id as string,
        title: formData.title,
        term: formData.term,
        priority: formData.priority,
        notes: formData.notes || "",
        description: formData.description || "",
        status: "NOT_STARTED",
        assignedTo: formData.assignedTo ?? session?.user?.id,
        details: formData.details,
      });
      if (!isSuccessResponse(response)) {
        toast.error("Erro ao cadastrar item");
        return;
      }
      invalidateItems()
      toast.success("Item cadastrado com sucesso!");
      form.reset();
      closeDialog(false);
    } catch (error) {
      toast.error("Erro inesperado");
    }
  }

  if (isLoading) {
    return <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-t-accent rounded-full animate-spin border-primary">
    </div>
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Criar novo item</DialogTitle>
        <DialogDescription>
        </DialogDescription>
      </DialogHeader>
      <Select
        onValueChange={setSelectedGroupId}
        value={selectedGroupId}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={data?.group[0].title} />
        </SelectTrigger>
        <SelectContent>
          {data?.group.map(group => (
            <SelectItem key={group.id} value={group.id}>{group.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Form {...form}>
        <form className="flex flex-col justify-between items-center gap-4 px-2 max-h-120 overflow-y-scroll" onSubmit={form.handleSubmit(onSubmit)}>
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
                  <Input
                    {...field}
                    placeholder="Descreva seu item"
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
              <FormItem className="w-full">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Descreva o item"
                    className="max-h-30 h-15"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 w-full">
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridade</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className={cn("", colorPriority(field.value))} size="sm">
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
                  <FormItem className="mr-auto w-full">
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
                              <span className="truncate min-w-0 max-w-50 sm:max-w-90">
                                {user.name}
                              </span>
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

          <FormField
            control={form.control}
            name="details"
            render={({ field }) => {
              return (
                <FormItem className="w-full">
                  <FormLabel>
                    Detalhes
                  </FormLabel>
                  <FormControl>
                    <div className="h-full min-h-80 max-h-100">
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

          <Button type="submit" className="mt-3.5 w-full">Cadastrar</Button>
        </form>
      </Form>
    </DialogContent>
  )
}