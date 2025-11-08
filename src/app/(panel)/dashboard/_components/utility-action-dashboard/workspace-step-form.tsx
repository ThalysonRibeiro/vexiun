"use client";

import { useEffect } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWorkspaceForm } from "@/hooks/use-workspace";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CATEGORIES_ARRAY } from "@/lib/constants";

export function WorkspaceStepForm({
  canProceed,
  form
}: {
  canProceed?: (valid: boolean) => void;
  form: ReturnType<typeof useWorkspaceForm>;
}) {
  useEffect(() => {
    canProceed?.(form.formState.isValid);
  }, [form.formState.isValid, canProceed]);

  return (
    <Form {...form}>
      <form className="space-y-4">
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
                        value={category.id}
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
      </form>
    </Form>
  );
}
