"use client"
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useWorkspace, WorkspaceFormData } from "../utility-action-dashboard/use-workspace-form";
import { updateWorkspace } from "@/app/actions/workspace";
import { isSuccessResponse } from "@/utils/error-handler";

interface WorkspaceFormProps {
  setAddWorkspace: (value: boolean) => boolean;
  workspaceId?: string;
  initialValues?: {
    title: string;
  }
}


export function WorkspaceForm({ setAddWorkspace, workspaceId, initialValues }: WorkspaceFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);

  const form = useWorkspace({ initialValues: initialValues });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setAddWorkspace(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setAddWorkspace]);

  async function onSubmit(formData: WorkspaceFormData) {
    setIsLoading(true);

    if (workspaceId) {
      const response = await updateWorkspace({
        workspaceId: workspaceId,
        title: formData.title
      });
      setIsLoading(false);
      setAddWorkspace(false);
      if (!isSuccessResponse(response)) {
        toast.error(response.error);
      }
      toast.success("Atualizado com sucesso");
    }

    if (isLoading) {
      return (
        <p>carregando...</p>
      )
    }
  }

  return (
    <div ref={formRef}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {workspaceId !== undefined
                    ? "Atualizar Workspace"
                    : "Adicionar Workspace"
                  }
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="title"
                    autoFocus
                    placeholder="Digite o nome da Workspace"
                    aria-describedby="Workspace-name-error"
                    aria-required="true"
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