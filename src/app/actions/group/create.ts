"use server"
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  ERROR_MESSAGES, successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { Group } from "@/generated/prisma";
import { validateWorkspacePermission } from "@/lib/db/validators";
import { createGroupFormSchema, CreateGroupType } from "./group-schema";


export const createGroup = withAuth(async (
  userId,
  session,
  formData: CreateGroupType): Promise<ActionResponse<Group | string>> => {

  const schema = createGroupFormSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };

  await validateWorkspacePermission(
    formData.workspaceId,
    userId,
    "ADMIN"
  );

  const newGroup = await prisma.group.create({
    data: {
      workspaceId: formData.workspaceId,
      title: formData.title,
      textColor: formData.textColor,
    }
  });

  if (formData.revalidatePaths?.length) {
    formData.revalidatePaths.forEach((path) => revalidatePath(path));
  };
  return successResponse(newGroup, "Grupo criado com sucesso")
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);