"use server"
import prisma from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { ActionResponse, handleError, successResponse } from "@/lib/errors/error-handler";
import { AuthenticationError, NotFoundError, RelationError, ValidationError } from "@/lib/errors/custom-errors";
import { ERROR_MESSAGES } from "@/lib/errors/messages";

const formSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
});

export type DeclineWorkspaceInvitationType = z.infer<typeof formSchema>;

export async function declineWorkspaceInvitation(formData: DeclineWorkspaceInvitationType): Promise<ActionResponse<string>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }
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
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};