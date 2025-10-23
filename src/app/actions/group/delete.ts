"use server"
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  ERROR_MESSAGES,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { DeleteGroupType, groupIdFormSchema } from "./group-schema";

export const deleteGroup = withAuth(async (
  userId,
  session,
  formData: DeleteGroupType): Promise<ActionResponse<string>> => {

  const schema = groupIdFormSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  await prisma.group.delete({
    where: {
      id: formData.groupId,
    }
  });
  if (formData.revalidatePaths?.length) {
    formData.revalidatePaths.forEach((path) => revalidatePath(path));
  };
  return successResponse("Grupo deletado com sucesso");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);