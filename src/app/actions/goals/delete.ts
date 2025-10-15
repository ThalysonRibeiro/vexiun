"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { NotFoundError } from "@/lib/errors";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { handleError, successResponse } from "@/utils/error-handler";

const formSchema = z.object({
  goalId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export async function deleteGoal(formData: z.infer<typeof formSchema>) {
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    };
  };
  try {
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
  } catch (error) {
    return handleError(ERROR_MESSAGES.GENERIC);
  };
};