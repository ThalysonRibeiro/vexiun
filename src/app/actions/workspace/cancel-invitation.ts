"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
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
import { validateWorkspacePermission } from "@/lib/db/validators";

const formSchema = z.object({
  invitationId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export type CancelWorkspaceInvitationType = z.infer<typeof formSchema>;

export const cancelWorkspaceInvitation = withAuth(async (
  userId,
  session,
  formData: CancelWorkspaceInvitationType
): Promise<ActionResponse<string>> => {

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    throw new ValidationError(schema.error.issues[0].message);
  };
  const invitation = await prisma.workspaceInvitation.findUnique({
    where: { id: formData.invitationId },
    select: {
      id: true,
      workspaceId: true,
      invitedBy: true,
      status: true,
      user: {
        select: { name: true }
      }
    }
  });

  if (!invitation) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.INVITATION)
  };
  if (invitation.status !== "PENDING") {
    throw new DuplicateError(ERROR_MESSAGES.BUSINESS.INVITATION_ALREADY_PROCESSED);

  };
  if (invitation.invitedBy !== userId) {
    throw new RelationError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
  };

  if (invitation.invitedBy !== userId) {
    await validateWorkspacePermission(
      invitation.workspaceId,
      userId,
      "ADMIN"
    );
  };
  await prisma.workspaceInvitation.update({
    where: { id: invitation.id },
    data: { status: "CANCELLED" }
  });
  revalidatePath(`/workspace`);

  return successResponse(`Convite para ${invitation.user.name} cancelado`);


}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);