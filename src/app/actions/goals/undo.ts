"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { ERROR_MESSAGES, NotFoundError, successResponse, withAuth } from "@/lib/errors";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  id: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
});

export const goalUndo = withAuth(async (userId, session, formData: z.infer<typeof formSchema>) => {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    };
  }

  const existingGoalCompletion = await prisma.goalCompletions.findUnique({
    where: { id: formData.id },
    select: { id: true }
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
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
