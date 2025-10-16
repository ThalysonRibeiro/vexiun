"use server"
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { ERROR_MESSAGES } from "@/lib/errors/messages";
import { ValidationError } from "@/lib/errors/custom-errors";
import { handleError, successResponse } from "@/lib/errors/error-handler";

const formSchema = z.object({
  title: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
});

export async function createGoal(formData: z.infer<typeof formSchema>) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  };

  try {
    if (formData.desiredWeeklyFrequency > 7) {
      throw new ValidationError(ERROR_MESSAGES.VALIDATION.MAX_LENGTH);
    }
    const result = await prisma.goals.create({
      data: {
        userId: userId,
        title: formData.title,
        desiredWeeklyFrequency: formData.desiredWeeklyFrequency
      }
    })

    revalidatePath("/dashboard/Workspace");
    return successResponse(result, "Meta cadastrada com sucesso!");
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  }
}