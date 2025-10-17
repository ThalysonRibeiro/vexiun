"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import {
  ActionResponse,
  ERROR_MESSAGES,
  NotFoundError,
  RelationError,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";

const formSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export type DeclineWorkspaceInvitationType = z.infer<typeof formSchema>;

export const declineWorkspaceInvitation = withAuth(async (
  userId,
  session,
  formData: DeclineWorkspaceInvitationType
): Promise<ActionResponse<string>> => {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  const invitation = await prisma.workspaceInvitation.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: formData.workspaceId, userId
      }
    },
  });
  if (!invitation) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.INVITATION);
  };
  if (invitation.userId !== userId) {
    throw new RelationError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
  };
  // await prisma.workspaceInvitation.delete({ where: { id: invitation.id } });
  await prisma.workspaceInvitation.update({
    where: { id: invitation.id },
    data: { status: "DECLINED" },
  });

  return successResponse("Convite recusado com sucesso");

}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);