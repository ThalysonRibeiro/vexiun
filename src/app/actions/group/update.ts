"use server"
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  ERROR_MESSAGES,
  NotFoundError,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { validateGroupExists, validateWorkspacePermission } from "@/lib/db/validators";
import { updateGroupFormSchema, UpdateGroupType } from "./group-schema";


export const updateGroup = withAuth(async (
  userId,
  session,
  formData: UpdateGroupType): Promise<ActionResponse<string>> => {

  const schema = updateGroupFormSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };

  const existingGroup = await validateGroupExists(formData.groupId);

  if (!existingGroup) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.GROUP);
  }

  await validateWorkspacePermission(
    formData.workspaceId,
    userId,
    "ADMIN"
  );

  await prisma.group.update({
    where: { id: formData.groupId },
    data: {
      title: formData.title,
      textColor: formData.textColor
    }
  });

  if (formData.revalidatePaths?.length) {
    formData.revalidatePaths.forEach((path) => revalidatePath(path));
  };

  return successResponse("Grupo atualizado com sucesso");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);