"use server"
import prisma from "@/lib/prisma";
import { z } from "zod"
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { WorkspaceRole } from "@/generated/prisma";
import { notificationMessages } from "@/lib/notifications/messages";
import { createAndSendNotification } from "../notification";
import { handleError, successResponse } from "@/utils/error-handler";
import { DuplicateError, NotFoundError, RelationError } from "@/lib/errors";
import { ERROR_MESSAGES } from "@/utils/error-messages";

const formSchema = z.object({
  userId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  workspaceId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export async function acceptWorkspaceInvitation(formData: z.infer<typeof formSchema>) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };
  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  };
  try {
    await prisma.$transaction(async (tx) => {
      const invitation = await tx.workspaceInvitation.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: formData.workspaceId,
            userId,
          },
        },
        include: {
          workspace: { select: { id: true, title: true } },
        },
      });
      if (!invitation) {
        throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.NOTIFICATION);
      };
      if (invitation.userId !== session?.user?.id) {
        throw new RelationError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
      };
      if (invitation.expiresAt && invitation.expiresAt < new Date()) {
        await tx.workspaceInvitation.update({
          where: { id: invitation.id },
          data: { status: "EXPIRED" },
        });
        throw new NotFoundError(ERROR_MESSAGES.REQUESTS.EXPIRED);
      };

      const existingMember = await tx.workspaceMember.findUnique({
        where: {
          workspaceId_userId: {
            workspaceId: formData.workspaceId,
            userId: userId,
          },
        },
      });

      if (existingMember) {
        await tx.workspaceInvitation.update({
          where: { id: invitation.id },
          data: { status: "ACCEPTED" },
        });
        throw new DuplicateError(ERROR_MESSAGES.REQUESTS.ALREADY_ACCEPTED);
      };

      const member = await tx.workspaceMember.create({
        data: {
          workspaceId: invitation.workspaceId,
          userId,
          role: "MEMBER" as WorkspaceRole
        },
      });

      await tx.workspaceInvitation.update({
        where: { id: invitation.id },
        data: { status: "ACCEPTED" },
      });

      const res = await createAndSendNotification({
        userId: invitation.invitedBy,
        referenceId: invitation.workspaceId,
        nameReference: session.user.name as string,
        image: session.user.image as string,
        message: notificationMessages.WORKSPACE_ACCEPTED(session.user.name as string, invitation.workspace.title),
        type: "WORKSPACE_ACCEPTED",
      });

      return { workspace: invitation.workspace, member, res };
    });

    revalidatePath("/dashboard");
    return successResponse();
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};