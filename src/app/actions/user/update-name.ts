"use server"
import prisma from "@/lib/prisma";
import {
  ActionResponse, ERROR_MESSAGES, successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { validateUserExists } from "@/lib/db/validators";
import { updateNameSchema, UpdateNameType } from "./user-schema";

export const updateName = withAuth(async (
  userId,
  session,
  formData: UpdateNameType
): Promise<ActionResponse<string>> => {

  const schema = updateNameSchema.safeParse(formData);
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
  return successResponse("Nome atualizado com sucesso")

}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);