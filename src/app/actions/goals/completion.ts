"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  ERROR_MESSAGES,
  NotFoundError,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { endOfWeek, startOfWeek } from "date-fns";

const formSchema = z.object({
  goalId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export const goalCompletion = withAuth(async (
  userId,
  session,
  formData: z.infer<typeof formSchema>) => {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return {
      error: schema.error.issues[0].message
    }
  }

  const existingGoal = await prisma.goals.findUnique({
    where: { id: formData.goalId },
    select: { id: true, desiredWeeklyFrequency: true, title: true },
  });
  if (!existingGoal) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.GOAL);
  };
  const completionCount = await prisma.goalCompletions.count({
    where: {
      goalId: existingGoal.id,
      createdAt: {
        gte: weekStart,
        lte: weekEnd,
      }
    }
  });
  if (completionCount >= existingGoal.desiredWeeklyFrequency) {
    throw new ValidationError("Limite de conclusão atingido nesta semana.");
  }
  const result = await prisma.goalCompletions.create({
    data: {
      goalId: existingGoal.id,
    },
  });
  revalidatePath("/dashboard/Workspace");
  return successResponse(result, `Parabêns você completou a meta ${existingGoal.title}.`);
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);