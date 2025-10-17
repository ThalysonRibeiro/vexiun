"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  ActionResponse, ERROR_MESSAGES, successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { validateUserExists } from "@/lib/db/validators";

const formSchema = z.object({
  userId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  name: z.string()
    .min(3, ERROR_MESSAGES.VALIDATION.MIN_LENGTH)
    .max(100, ERROR_MESSAGES.VALIDATION.MAX_LENGTH),
});

export type UpdateNameType = z.infer<typeof formSchema>;

export const updateName = withAuth(async (
  userId,
  session,
  formData: UpdateNameType
): Promise<ActionResponse<string>> => {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  await validateUserExists(formData.userId);

  await prisma.user.update({
    where: { id: formData.userId },
    data: {
      name: formData.name,
    }
  });
  revalidatePath("/dashboard/profile");
  return successResponse("Nome atualizado com sucesso")

}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);