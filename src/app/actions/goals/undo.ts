"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { ERROR_MESSAGES } from "@/lib/errors/messages";
import { NotFoundError } from "@/lib/errors/custom-errors";
import { handleError, successResponse } from "@/lib/errors/error-handler";

const formSchema = z.object({
  id: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export async function goalUndo(formData: z.infer<typeof formSchema>) {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }
  try {
    const existingGoalCompletion = await prisma.goalCompletions.findUnique({
      where: { id: formData.id },
      select: { id: true },
    });
    if (!existingGoalCompletion) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.GOAL);
    }
    const result = await prisma.goalCompletions.delete({
      where: {
        id: existingGoalCompletion.id
      }
    });
    revalidatePath("/dashboard/Workspace");
    return successResponse(result, "Desfeita");
  } catch (error) {
    return handleError(ERROR_MESSAGES.GENERIC);
  };
};