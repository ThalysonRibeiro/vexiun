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
} from "@/components/ui/form";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUpdateWorkspace } from "@/hooks/use-workspace";
import { useWorkspace, WorkspaceFormData } from "../../_components/utility-action-dashboard/use-workspace-form";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { isSuccessResponse } from "@/lib/errors";

interface WorkspaceFormProps {
  workspaceId?: string;
  initialValues?: {
    title: string;
  }
}

export function WorkspaceForm({ workspaceId, initialValues }: WorkspaceFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const form = useWorkspace({ initialValues: initialValues });
  const updateWorkspace = useUpdateWorkspace();

  async function onSubmit(formData: WorkspaceFormData) {
    setIsLoading(true);

    if (workspaceId) {
      const response = await updateWorkspace.mutateAsync({
        workspaceId: workspaceId,
        title: formData.title
      });
      if (!isSuccessResponse(response)) {
        return;
      }
      setIsLoading(false);
      toast.success(response.data);
      closeRef.current?.click();
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
                  Atualizar Workspace
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
          <Button>
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Salvar"}
          </Button>
          <DialogClose ref={closeRef} className="hidden" />
        </form>
      </Form>
    </div>
  )
}