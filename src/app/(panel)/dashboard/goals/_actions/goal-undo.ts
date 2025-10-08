"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  id: z.string().min(1, "O id é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function goalUndo(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  try {
    const existingGoalCompletion = await prisma.goalCompletions.findFirst({
      where: {
        id: formData.id
      }
    });
    if (!existingGoalCompletion) {
      return {
        error: "Erro ao completar meta"
      }
    }
    await prisma.goalCompletions.delete({
      where: {
        id: existingGoalCompletion.id
      }
    });
    revalidatePath("/dashboard/Workspace");
    return {
      data: "Desfeita"
    }
  } catch (error) {
    return {
      error: "Erro ao completar meta"
    }
  }
}