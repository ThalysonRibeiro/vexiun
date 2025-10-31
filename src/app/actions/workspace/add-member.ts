"use server";
import prisma from "@/lib/prisma";
import {
  ActionResponse,
  DuplicateError,
  ERROR_MESSAGES,
  NotFoundError,
  successResponse,
  ValidationError,
  withAuth
} from "@/lib/errors";
import { revalidatePath } from "next/cache";
import { validateWorkspaceExists, validateWorkspacePermission } from "@/lib/db/validators";
import { createAndSendNotification } from "../notification";
import { addMemnberSchema, AddWorkspaceMemberType } from "./workspace-schema";

export type AddWorkspaceMemberResponse = {
  invitedCount: number;
  skippedCount: number;
};

export const addWorkspaceMember = withAuth(
  async (
    userId,
    session,
    formData: AddWorkspaceMemberType
  ): Promise<ActionResponse<AddWorkspaceMemberResponse>> => {
    const schema = addMemnberSchema.safeParse(formData);
    if (!schema.success) {
      throw new ValidationError(schema.error.issues[0].message);
    }
    const [workspace, member] = await Promise.all([
      validateWorkspaceExists(formData.workspaceId),
      validateWorkspacePermission(formData.workspaceId, userId, "ADMIN")
    ]);

    const result = await prisma.$transaction(async (tx) => {
      const existingUsers = await tx.user.findMany({
        where: {
          id: { in: formData.invitationUsersId }
        },
        select: { id: true, name: true, email: true }
      });

      if (existingUsers.length === 0) {
        throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.USER);
      }

      const [existingMembers, existingInvitations] = await Promise.all([
        tx.workspaceMember.findMany({
          where: {
            workspaceId: formData.workspaceId,
            userId: { in: formData.invitationUsersId }
          },
          select: { userId: true }
        }),
        tx.workspaceInvitation.findMany({
          where: {
            workspaceId: formData.workspaceId,
            userId: { in: formData.invitationUsersId },
            status: "PENDING"
          },
          select: { userId: true }
        })
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
      }

      await tx.workspaceInvitation.deleteMany({
        where: {
          workspaceId: formData.workspaceId,
          userId: { in: idsToInvite },
          status: { in: ["DECLINED", "CANCELLED", "EXPIRED"] }
        }
      });

      await tx.workspaceInvitation.createMany({
        data: idsToInvite.map((userId) => ({
          workspaceId: formData.workspaceId,
          userId,
          invitedBy: session?.user?.id as string,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias
        }))
      });

      await Promise.all(
        idsToInvite.map((userId) =>
          createAndSendNotification({
            userId,
            referenceId: workspace.id,
            nameReference: session?.user?.name as string,
            image: session?.user?.image as string,
            message: `${session?.user?.name} convidou você para "${workspace?.title}"`,
            type: "WORKSPACE_INVITE"
          })
        )
      );

      return {
        invitedCount: idsToInvite.length,
        skippedCount: formData.invitationUsersId.length - idsToInvite.length
      };
    });

    if (formData.revalidatePaths?.length) {
      formData.revalidatePaths.forEach((path) => revalidatePath(path));
    }

    const message =
      result.skippedCount > 0
        ? `${result.invitedCount} convite(s) enviado(s). ${result.skippedCount} usuário(s) já são membros ou têm convite pendente.`
        : `${result.invitedCount} convite(s) enviado(s) com sucesso`;

    return successResponse(result, message);
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
