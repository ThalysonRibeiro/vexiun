"use server";
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
import { DeleteGroupType, groupIdFormSchema } from "./group-schema";
import { validateGroupExists, validateWorkspacePermission } from "@/lib/db/validators";

export const deleteGroup = withAuth(
  async (userId, session, formData: DeleteGroupType): Promise<ActionResponse<string>> => {
    const schema = groupIdFormSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }
    const existingGroup = await validateGroupExists(formData.groupId);

    if (!existingGroup) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.GROUP);
    }

    await validateWorkspacePermission(formData.workspaceId, userId, "OWNER");
    await prisma.group.delete({
      where: {
        id: formData.groupId
      }
    });
    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }
    return successResponse("Grupo deletado com sucesso");
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
