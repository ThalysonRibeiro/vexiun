"use server";
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  ERROR_MESSAGES,
  NotFoundError,
  RelationError,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { DeclineWorkspaceInvitationType, workspaceIdSchema } from "./workspace-schema";
import { revalidatePath } from "next/cache";

export const declineWorkspaceInvitation = withAuth(
  async (
    userId,
    session,
    formData: DeclineWorkspaceInvitationType
  ): Promise<ActionResponse<string>> => {
    const schema = workspaceIdSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }
    const invitation = await prisma.workspaceInvitation.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: formData.workspaceId,
          userId
        }
      }
    });
    if (!invitation) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.INVITATION);
    }
    if (invitation.userId !== userId) {
      throw new RelationError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
    }

    await prisma.workspaceInvitation.update({
      where: { id: invitation.id },
      data: { status: "DECLINED" }
    });

    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }

    return successResponse("Convite recusado com sucesso");
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
