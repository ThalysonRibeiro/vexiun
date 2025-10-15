"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { validateWorkspacePermission } from "@/lib/db/validators";
import { z } from "zod";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { DuplicateError, NotFoundError, RelationError } from "@/lib/errors";

const formSchema = z.object({
  invitationId: z.string().min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
});

export async function cancelWorkspaceInvitation(formData: z.infer<typeof formSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };
  const userId = session?.user?.id;

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  };

  try {
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

  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};