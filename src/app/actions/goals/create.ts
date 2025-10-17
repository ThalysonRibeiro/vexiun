"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  ERROR_MESSAGES,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";

const formSchema = z.object({
  title: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7),
});

export const createGoal = withAuth(async (
  userId,
  session,
  formData: z.infer<typeof formSchema>) => {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  };

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
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);