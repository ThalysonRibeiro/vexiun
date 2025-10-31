"use client";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useUpdateWorkspace, useWorkspaceForm } from "@/hooks/use-workspace";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Tag } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { isSuccessResponse } from "@/lib/errors";
import { Textarea } from "@/components/ui/textarea";
import { CATEGORIES_ARRAY } from "@/lib/constants";
import { WorkspaceCategory } from "@/generated/prisma";
import { WorkspaceFormData } from "@/app/actions/workspace/workspace-schema";

interface WorkspaceFormProps {
  workspaceId?: string;
  initialValues?: {
    title: string;
    invitationUsersId: string[];
    description?: string;
    categories?: WorkspaceCategory[];
  };
}

export function WorkspaceForm({ workspaceId, initialValues }: WorkspaceFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const form = useWorkspaceForm({ initialValues: initialValues });
  const updateWorkspace = useUpdateWorkspace();

  async function onSubmit(formData: WorkspaceFormData) {
    setIsLoading(true);

    if (workspaceId) {
      const response = await updateWorkspace.mutateAsync({
        workspaceId: workspaceId,
        title: formData.title,
        description: formData.description,
        categories: formData.categories
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Titulo</FormLabel>
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

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id="description"
                    className="max-h-30 min-h-20 h-full"
                    placeholder="Digite a descrição da Workspace"
                    aria-describedby="Workspace-name-error"
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
            name="categories"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categorias</FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="multiple"
                    spacing={2}
                    size={"sm"}
                    variant={"outline"}
                    value={field.value || []}
                    onValueChange={field.onChange}
                    className="grid grid-cols-4 gap-2 justify-start"
                  >
                    {CATEGORIES_ARRAY.map((category) => {
                      const Icon = category.icon;
                      return (
                        <ToggleGroupItem
                          key={category.id}
                          value={category.id} // melhor usar ID em vez de label
                          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                          <Icon className="h-4 w-4" />
                          {category.label}
                        </ToggleGroupItem>
                      );
                    })}
                  </ToggleGroup>
                </FormControl>
                <FormDescription>
                  Selecione as categorias que se aplicam a essa Workspace
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button className="w-full">
            {isLoading ? <LoaderCircle className="animate-spin" /> : "Salvar"}
          </Button>
          <DialogClose ref={closeRef} className="hidden" />
        </form>
      </Form>
    </div>
  );
}
