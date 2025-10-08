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
import { createWorkspace } from "../../_actions/create-workspace";
import { toast } from "sonner";
import { updateWorkspace } from "../../_actions/update-workspace";
import { useWorkspace, WorkspaceFormData } from "../utility-action-dashboard/use-workspace-form";

interface WorkspaceFormProps {
  setAddWorkspace: (value: boolean) => boolean;
  WorkspaceId?: string;
  initialValues?: {
    title: string;
  }
}


export function WorkspaceForm({ setAddWorkspace, WorkspaceId, initialValues }: WorkspaceFormProps) {
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

    if (WorkspaceId) {
      const response = await updateWorkspace({
        workspaceId: WorkspaceId,
        title: formData.title
      });
      setIsLoading(false);
      setAddWorkspace(false);
      if (response.error) {
        toast.error(response.error);
      }
      toast.success(response.data);
    } else {
      try {
        const response = await createWorkspace({
          title: formData.title
        });
        if (response.error) {
          toast.error("Erro ao cadastrar Workspace");
          return;
        }
        toast.success("Workspace cadastrada com sucesso!");
        setAddWorkspace(false);
        form.reset();
      } catch (error) {
        toast.error("Erro inesperado");
      }
      finally {
        setIsLoading(false);
      }
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
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {WorkspaceId !== undefined
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