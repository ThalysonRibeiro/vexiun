"use server";
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  ERROR_MESSAGES,
  PermissionError,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { validateWorkspaceExists, validateWorkspacePermission } from "@/lib/db/validators";
import { DeleteWorkspaceType, workspaceIdSchema } from "./workspace-schema";

export const deleteWorkspace = withAuth(
  async (userId, session, formData: DeleteWorkspaceType): Promise<ActionResponse<string>> => {
    const schema = workspaceIdSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }

    const existingWorkspace = await validateWorkspaceExists(formData.workspaceId);

    await validateWorkspacePermission(formData.workspaceId, userId, "OWNER");

    await prisma.$transaction(async (tx) => {
      await tx.notification.deleteMany({
        where: { referenceId: existingWorkspace.id }
      });

      await tx.workspaceInvitation.deleteMany({
        where: { workspaceId: existingWorkspace.id }
      });

      await tx.workspace.delete({
        where: { id: existingWorkspace.id }
      });
    });
    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }
    return successResponse("Workspace deletada com sucesso!");
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
