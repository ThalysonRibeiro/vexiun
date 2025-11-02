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
import { cancelInvitationSchema, CancelWorkspaceInvitationType } from "./workspace-schema";

export const cancelWorkspaceInvitation = withAuth(
  async (
    userId,
    session,
    formData: CancelWorkspaceInvitationType
  ): Promise<ActionResponse<string>> => {
    const schema = cancelInvitationSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }
    const invitations = await prisma.workspaceInvitation.findMany({
      where: {
        id: { in: formData.invitationIds },
        status: "PENDING",
        workspace: {
          members: {
            some: { userId, role: "OWNER" }
          }
        }
      },
      select: { id: true }
    });

    if (invitations.length === 0) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.INVITATION);
    }

    await prisma.workspaceInvitation.updateMany({
      where: { id: { in: invitations.map((i) => i.id) } },
      data: { status: "CANCELLED" }
    });

    formData.revalidatePaths?.forEach((path) => revalidatePath(path));

    return successResponse(
      `${invitations.length} convite${invitations.length > 1 ? "s" : ""} cancelado${invitations.length > 1 ? "s" : ""}`
    );
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
