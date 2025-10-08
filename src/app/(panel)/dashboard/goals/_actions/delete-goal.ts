"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  goalId: z.string().min(1, "O id da meta é obrigatório"),
});

type FormSchema = z.infer<typeof formSchema>;

export async function deleteGoal(formData: FormSchema) {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  try {
    const existingGoal = await prisma.goals.findFirst({
      where: { id: formData.goalId }
    });
    if (!existingGoal) {
      return {
        error: "Falha ao deletar Meta"
      }
    }
    await prisma.goals.delete({
      where: { id: existingGoal.id }
    });
    revalidatePath("/dashboard/Workspace");
    return { data: "Meta deletada com sucesso!" }
  } catch (error) {
    return {
      error: "Falha ao deletar Meta"
    }
  }
}