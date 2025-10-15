"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthenticationError } from "@/lib/errors";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { validateWorkspacePermission } from "@/lib/db/validators";

export async function getMyPendingInvitations() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }
    const invitations = await prisma.workspaceInvitation.findMany({
      where: {
        userId: userId,
        status: "PENDING",
        // ✅ Filtrar expirados se tiver expiresAt
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      include: {
        workspace: {
          select: {
            id: true,
            title: true,
          },
        },
        inviter: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(invitations);
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};

// Convites enviados (pelo workspace)
export async function getWorkspacePendingInvitations(workspaceId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }
    // ✅ Verificar permissão
    await validateWorkspacePermission(workspaceId, userId, "ADMIN");

    const invitations = await prisma.workspaceInvitation.findMany({
      where: {
        workspaceId,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        inviter: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return successResponse(invitations);
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};