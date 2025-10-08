"use client"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { createItem } from "../../_actions/create-item";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarTerm } from "../main-board/calendar-term";
import { Group, Priority, Status } from "@/generated/prisma";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

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
  groups: Group[];
  status: Status
}

export function DialogContentNewItem({ closeDialog, groups, initialValues, status }: DialogContentNewItemProps) {
  const form = UseItemForm({ initialValues });
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  async function onSubmit(formData: ItemFormData) {
    try {
      const response = await createItem({
        groupId: selectedGroupId || groups[0].id,
        title: formData.title,
        term: formData.term,
        priority: formData.priority,
        status: status,
        notes: formData.notes || "",
        description: formData.description || ""
      });
      if (response.error) {

        toast.error("Erro ao cadastrar item");
        return;
      }
      toast.success("Item cadastrado com sucesso!");
      form.reset();
      closeDialog(false);
    } catch (error) {
      toast.error("Erro inesperado");
    }
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
          <SelectValue placeholder={groups[0].title} />
        </SelectTrigger>
        <SelectContent>
          {groups.map(group => (
            <SelectItem key={group.id} value={group.id}>{group.title}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Form {...form}>
        <form className="flex flex-col justify-between items-center gap-4 px-2" onSubmit={form.handleSubmit(onSubmit)}>
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Prioridade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CRITICAL">Crítico</SelectItem>
                        <SelectItem value="HIGH">Alto</SelectItem>
                        <SelectItem value="MEDIUM">Medio</SelectItem>
                        <SelectItem value="LOW">Baixo</SelectItem>
                        <SelectItem value="STANDARD">Padrão</SelectItem>
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
          <Button type="submit" className="mt-3.5 w-full">Cadastrar</Button>
        </form>
      </Form>
    </DialogContent>
  )
}