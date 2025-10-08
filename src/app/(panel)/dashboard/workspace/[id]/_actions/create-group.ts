"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  workspaceId: z.string().min(1, "O id é obrigatório"),
  title: z.string().min(1, "O titulo é obrigatório"),
  textColor: z.string().min(4, "O titulo é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createGroup(formData: FormSchema) {
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
      error: "Falha ao cadastrar grupo"
    }
  }
  try {
    const newGroup = await prisma.group.create({
      data: {
        workspaceId: existingWorkspace.id,
        title: formData.title,
        textColor: formData.textColor,
      }
    });
    revalidatePath("/dashboard/Workspace");
    return { data: newGroup }
  } catch (error) {
    return {
      error: "Falha ao cadastrar grupo"
    }
  }
}