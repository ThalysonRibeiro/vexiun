"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { handleError, successResponse } from "@/utils/error-handler";
import { NotFoundError, RelationError } from "@/lib/errors";
import { ERROR_MESSAGES } from "@/utils/error-messages";

const formSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export async function declineWorkspaceInvitation(formData: z.infer<typeof formSchema>) {
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
      where: {
        workspaceId_userId: {
          workspaceId: formData.workspaceId, userId
        }
      },
    });
    if (!invitation) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.INVITATION);
    };
    if (invitation.userId !== session.user.id) {
      throw new RelationError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
    };
    // await prisma.workspaceInvitation.delete({ where: { id: invitation.id } });
    await prisma.workspaceInvitation.update({
      where: { id: invitation.id },
      data: { status: "DECLINED" },
    });

    return successResponse();
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};