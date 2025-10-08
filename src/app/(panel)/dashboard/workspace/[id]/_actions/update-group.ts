"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  id: z.string().min(1, "o id é obrigatóriro"),
  title: z.string().min(1, "O titulo é obrigatório"),
  textColor: z.string().min(4, "O cor é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function updateGroup(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  const existingGroup = await prisma.group.findUnique({
    where: { id: formData.id }
  });

  if (!existingGroup) {
    return {
      error: "Grupo não encontrado"
    }
  }

  try {
    await prisma.group.update({
      where: { id: formData.id },
      data: {
        title: formData.title,
        textColor: formData.textColor
      }
    });
    revalidatePath("/dashboard/Workspace");
    return;
  } catch (error) {
    return {
      error: "Falha ao atualizar grupo"
    }
  }
}