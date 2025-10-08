"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  title: z.string().min(1, "Informe a atividade qeu deseja realizar"),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
});

type FormSchema = z.infer<typeof formSchema>;

export async function createGoal(formData: FormSchema) {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: "Falha ao cadastrar Meta"
    }
  }
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  try {
    if (formData.desiredWeeklyFrequency > 7) {
      return {
        error: "Falha ao cadastrar Meta"
      }
    }
    await prisma.goals.create({
      data: {
        userId: session.user.id,
        title: formData.title,
        desiredWeeklyFrequency: formData.desiredWeeklyFrequency
      }
    })

    revalidatePath("/dashboard/Workspace");
    return { data: "Meta cadastrada com sucesso!" };
  } catch (error) {
    return {
      error: "Falha ao cadastrar Meta"
    }
  }
}