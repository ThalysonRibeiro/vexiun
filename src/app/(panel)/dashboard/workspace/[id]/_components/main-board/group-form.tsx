"use client";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { useCreateGroup, UseGroupForm, useUpdateGroup } from "@/hooks/use-groups";
import { GroupFormData } from "@/app/actions/group";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

interface CreateGroupFormProps {
  setAddGroup: (value: boolean) => boolean;
  groupId?: string;
  initialValues?: {
    title: string;
    textColor: string;
  };
  workspaceId: string;
}

export function GroupForm(props: CreateGroupFormProps) {
  const { setAddGroup, initialValues, groupId, workspaceId } = props;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLDivElement>(null);
  const form = UseGroupForm({ initialValues: initialValues });
  const createGroup = useCreateGroup();
  const updateGroup = useUpdateGroup();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setAddGroup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setAddGroup]);

  async function onSubmit(formData: GroupFormData) {
    setIsLoading(true);

    if (groupId) {
      await updateGroup.mutateAsync({
        workspaceId,
        groupId,
        title: formData.title,
        textColor: formData.textColor,
        revalidatePaths: [`/dashboard/workspace/${workspaceId}`]
      });
      setIsLoading(false);
      setAddGroup(false);
      toast.success("Grupo atualizado com sucesso!");
      return;
    }

    const response = await createGroup.mutateAsync({
      workspaceId,
      title: formData.title,
      textColor: formData.textColor,
      revalidatePaths: [`/dashboard/workspace/${workspaceId}`]
    });
    if (!isSuccessResponse(response)) {
      toast.error("Erro ao cadastrar grupo");
      return;
    }
    toast.success("Grupo cadastrado com sucesso!");
    setAddGroup(false);
    setIsLoading(false);
  }

  if (isLoading) {
    return <p>carregando...</p>;
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
              <FormItem className="rounded-full overflow-hidden border-2 w-8 h-8 relative mt-2.5 mb-auto">
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
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            disabled={isLoading}
            className="text-green-600 hover:text-green-700 mt-2.5 mb-auto"
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setAddGroup(false)}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700 mt-2.5 mb-auto"
          >
            <X className="h-4 w-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
