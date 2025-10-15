"use client"
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { GroupFormData, UseGroupForm } from "./use-group-form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { createGroup, updateGroup } from "@/app/actions/group";
import { isErrorResponse } from "@/utils/error-handler";


interface CreateGroupFormProps {
  setAddGroup: (value: boolean) => boolean;
  groupId?: string;
  initialValues?: {
    title: string;
    textColor: string;
  }
  workspaceId: string;
}

export function GroupForm({ setAddGroup, initialValues, groupId, workspaceId }: CreateGroupFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);

  const form = UseGroupForm({ initialValues: initialValues });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setAddGroup(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setAddGroup]);

  async function onSubmit(formData: GroupFormData) {
    setIsLoading(true);

    if (groupId) {
      await updateGroup({
        id: groupId,
        title: formData.title,
        textColor: formData.textColor
      });
      setIsLoading(false);
      setAddGroup(false)
      toast.success("Grupo atualizado com sucesso!");
      return;
    }

    try {
      const response = await createGroup({
        workspaceId: workspaceId,
        title: formData.title,
        textColor: formData.textColor,
      });
      if (isErrorResponse(response)) {
        toast.error("Erro ao cadastrar grupo");
        return;
      }
      toast.success("Grupo cadastrado com sucesso!");
      setAddGroup(false);
    } catch (error) {
      toast.error("Erro inesperado");
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <p>carregando...</p>
    )
  }
  return (
    <div ref={formRef}>
      <Form {...form}>
        <form className="flex items-center gap-2 max-w-100" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    id="title"
                    placeholder="Digite o nome do grupo"
                    aria-describedby="group-name-error"
                    aria-required="true"
                    className="mt-2"
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="textColor"
            render={({ field }) => (
              <FormItem className="rounded-full overflow-hidden border-2 w-8 h-8 relative">
                <FormControl>
                  <Input
                    {...field}
                    id="textColor"
                    type="color"
                    aria-describedby="group-name-error"
                    aria-required="true"
                    className="border-0 p-0 cursor-pointer w-15  h-15 absolute -top-1 -left-1 "
                  />
                </FormControl>
                <FormDescription />
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  )
}