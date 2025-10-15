"use server";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { validateWorkspacePermission, validateWorkspaceExists } from "@/lib/db/validators";
import { createAndSendNotification } from "../notification";
import { handleError, successResponse } from "@/utils/error-handler";
import { DuplicateError, NotFoundError } from "@/lib/errors";
import { ERROR_MESSAGES } from "@/utils/error-messages";

const formSchema = z.object({
  workspaceId: z.string()
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD)
    .cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID),
  invitationUsersId: z
    .array(z.string().cuid(ERROR_MESSAGES.VALIDATION.INVALID_ID))
    .min(1, ERROR_MESSAGES.VALIDATION.REQUIRED_FIELD),
  revalidatePaths: z.array(z.string()).optional(),
});

export async function addWorkspaceMember(formData: z.infer<typeof formSchema>) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: ERROR_MESSAGES.AUTH.NOT_AUTHENTICATED };
  };

  const schema = formSchema.safeParse(formData);
  if (!schema.success) {
    return { error: schema.error.issues[0].message };
  };

  try {
    const [workspace, member] = await Promise.all([
      validateWorkspaceExists(formData.workspaceId),
      validateWorkspacePermission(formData.workspaceId, session.user.id, "ADMIN"),
    ]);

    const result = await prisma.$transaction(async (tx) => {

      const existingUsers = await tx.user.findMany({
        where: {
          id: { in: formData.invitationUsersId },
        },
        select: { id: true, name: true, email: true },
      });

      if (existingUsers.length === 0) {
        throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.USER);
      };

      const [existingMembers, existingInvitations] = await Promise.all([
        tx.workspaceMember.findMany({
          where: {
            workspaceId: formData.workspaceId,
            userId: { in: formData.invitationUsersId },
          },
          select: { userId: true },
        }),
        tx.workspaceInvitation.findMany({
          where: {
            workspaceId: formData.workspaceId,
            userId: { in: formData.invitationUsersId },
            status: "PENDING",
          },
          select: { userId: true },
        }),
      ]);

      const idsToInvite = existingUsers
        .filter(
          (user) =>
            !existingMembers.some((member) => member.userId === user.id) &&
            !existingInvitations.some((inv) => inv.userId === user.id)
        )
        .map((user) => user.id);

      if (idsToInvite.length === 0) {
        throw new DuplicateError(ERROR_MESSAGES.DUPLICATE.MEMBERS);
      };

      await tx.workspaceInvitation.createMany({
        data: idsToInvite.map((userId) => ({
          workspaceId: formData.workspaceId,
          userId,
          invitedBy: session?.user?.id as string,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias
        })),
      });

      await Promise.all(
        idsToInvite.map((userId) =>
          createAndSendNotification({
            userId,
            referenceId: workspace.id,
            nameReference: session?.user?.name as string,
            image: session?.user?.image as string,
            message: `${session?.user?.name} convidou você para "${workspace?.title}"`,
            type: "WORKSPACE_INVITE",
          })
        )
      );

      return {
        invitedCount: idsToInvite.length,
        skippedCount: formData.invitationUsersId.length - idsToInvite.length,
      };
    });

    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    };

    const message =
      result.skippedCount > 0
        ? `${result.invitedCount} convite(s) enviado(s). ${result.skippedCount} usuário(s) já são membros ou têm convite pendente.`
        : `${result.invitedCount} convite(s) enviado(s) com sucesso`;

    return successResponse(result, message);
  } catch (error) {
    console.error("Erro ao enviar convites:", error);
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};