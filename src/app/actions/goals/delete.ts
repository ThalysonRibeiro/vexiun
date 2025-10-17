"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  ERROR_MESSAGES,
  NotFoundError,
  successResponse,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  goalId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export const deleteGoal = withAuth(async (
  userId,
  session,
  formData: z.infer<typeof formSchema>) => {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    };
  };

  const existingGoal = await prisma.goals.findUnique({
    where: { id: formData.goalId },
    select: { id: true },
  });
  if (!existingGoal) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.GOAL);
  };
  const result = await prisma.goals.delete({
    where: { id: existingGoal.id }
  });
  revalidatePath("/dashboard/Workspace");
  return successResponse(result, "Meta deletada com sucesso!");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);