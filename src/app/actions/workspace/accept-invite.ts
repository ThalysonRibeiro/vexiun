"use server";
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  DuplicateError,
  ERROR_MESSAGES,
  NotFoundError,
  RelationError,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { WorkspaceRole } from "@/generated/prisma";
import { createAndSendNotification } from "../notification";
import { notificationMessages } from "@/lib/notifications/messages";
import { AcceptWorkspaceInvitationType, workspaceIdSchema } from "./workspace-schema";

export const acceptWorkspaceInvitation = withAuth(
  async (
    userId,
    session,
    formData: AcceptWorkspaceInvitationType
  ): Promise<ActionResponse<string>> => {
    const schema = workspaceIdSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }
    await prisma.$transaction(async (tx) => {
      const invitation = await tx.workspaceInvitation.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: formData.workspaceId,
            userId
          }
        },
        include: {
          workspace: { select: { id: true, title: true } }
        }
      });
      if (!invitation) {
        throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.NOTIFICATION);
      }
      if (invitation.userId !== session?.user?.id) {
        throw new RelationError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
      }
      if (invitation.expiresAt && invitation.expiresAt < new Date()) {
        await tx.workspaceInvitation.update({
          where: { id: invitation.id },
          data: { status: "EXPIRED" }
        });
        throw new NotFoundError(ERROR_MESSAGES.REQUESTS.EXPIRED);
      }

      const existingMember = await tx.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: formData.workspaceId,
            userId: userId
          }
        }
      });

      if (existingMember) {
        await tx.workspaceInvitation.update({
          where: { id: invitation.id },
          data: { status: "ACCEPTED" }
        });
        throw new DuplicateError(ERROR_MESSAGES.REQUESTS.ALREADY_ACCEPTED);
      }

      const member = await tx.workspaceMember.create({
        data: {
          workspaceId: invitation.workspaceId,
          userId,
          role: "MEMBER" as WorkspaceRole
        }
      });

      await tx.workspaceInvitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" }
      });

      const res = await createAndSendNotification({
        userId: invitation.invitedBy,
        referenceId: invitation.workspaceId,
        nameReference: session.user.name as string,
        image: session.user.image as string,
        message: notificationMessages.WORKSPACE_ACCEPTED(
          session.user.name as string,
          invitation.workspace.title
        ),
        type: "WORKSPACE_ACCEPTED"
      });

      return { workspace: invitation.workspace, member, res };
    });

    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }
    return successResponse("Convite aceito com sucesso");
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
