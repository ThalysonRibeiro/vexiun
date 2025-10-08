"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  workspaceId: z.string().min(1, "O id é obrigatório"),
  title: z.string().min(1, "O titulo é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateWorkspace(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  const existingWorkspace = await prisma.workspace.findFirst({
    where: { id: formData.workspaceId }
  });
  if (!existingWorkspace) {
    return {
      error: "Workspace não encontrada"
    }
  }
  try {
    await prisma.workspace.update({
      where: { id: existingWorkspace.id },
      data: { title: formData.title }
    })
    revalidatePath("/dashboard");
    return {
      data: "Workspace atualizada com sucesso!"
    }
  } catch (error) {
    return {
      error: "Falha ao atualizar Workspace"
    }
  }
}