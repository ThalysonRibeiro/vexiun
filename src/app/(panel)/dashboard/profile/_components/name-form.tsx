"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { User } from "next-auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNameForm, useUpdateName } from "@/hooks/use-user";
import { isSuccessResponse } from "@/lib/errors/error-handler";

export function NameForme({ user }: { user: User }) {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const form = useNameForm({ initialValues: { name: user?.name || "" } });
  const updateName = useUpdateName();

  async function onSubmit(formData: { name: string }) {
    if (!user.id) return;

    const response = await updateName.mutateAsync({
      userId: user.id,
      name: formData.name,
      revalidatePaths: ["/dashboard/profile"]
    });
    if (!isSuccessResponse(response)) {
      toast.error("Erro ao atualizar nome");
      return;
    }
    toast.success("Nome alterado com sucesso!");
    setIsAdding(false);
  }

  return (
    <div className="border rounded-lg relative w-full hover:border-gray-700">
      <button
        onClick={() => setIsAdding(!isAdding)}
        className="w-full p-4 cursor-pointer flex justify-start items-center"
      >
        {isAdding ? (
          <span className="absolute bottom-2 right-2 px-2 py-1 border border-dashed border-red-400 text-red-400 rounded-md text-sm">
            Cancelar
          </span>
        ) : (
          <span title="Nome do usuário clique para editar" className="text-sm">
            {user.name}
          </span>
        )}
      </button>
      {isAdding && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-2 p-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Editar nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite seu nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size={"sm"} className="">
              Salvar
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
