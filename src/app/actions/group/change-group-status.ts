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
import { changeGroupStatusSchema, ChangeGroupStatusType } from "./group-schema";


export const changeGroupStatus = withAuth(async (
  userId,
  session,
  formData: ChangeGroupStatusType): Promise<ActionResponse<string>> => {

  const schema = changeGroupStatusSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };

  const existingGroup = await validateGroupExists(formData.groupId);

  if (!existingGroup) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.GROUP);
  }

  if (existingGroup.status !== "ACTIVE") {
    throw new ValidationError(ERROR_MESSAGES.STATUS.GROUP_INACTIVE);
  }

  await validateWorkspacePermission(
    formData.workspaceId,
    userId,
    "ADMIN"
  );

  await prisma.$transaction([
    prisma.group.update({
      where: { id: formData.groupId },
      data: {
        status: formData.status
      }
    }),
    prisma.item.updateMany({
      where: { groupId: formData.groupId },
      data: {
        entityStatus: formData.status
      }
    })
  ]);

  if (formData.revalidatePaths?.length) {
    formData.revalidatePaths.forEach((path) => revalidatePath(path));
  };

  return successResponse("Grupo movido para lixeira com sucesso!!");
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);