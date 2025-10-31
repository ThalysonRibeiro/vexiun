"use server";
import { validateWorkspacePermission } from "@/lib/db/validators";
import { ERROR_MESSAGES, successResponse, withAuth } from "@/lib/errors";
import prisma from "@/lib/prisma";

export const getMyPendingInvitations = withAuth(async (userId) => {
  const invitations = await prisma.workspaceInvitation.findMany({
    where: {
      userId: userId,
      status: "PENDING",
      // ✅ Filtrar expirados se tiver expiresAt
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
    },
    include: {
      workspace: {
        select: {
          id: true,
          title: true
        }
      },
      inviter: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return successResponse(invitations);
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);

// Convites enviados (pelo workspace)
export const getWorkspacePendingInvitations = withAuth(
  async (userId, session, workspaceId: string) => {
    await validateWorkspacePermission(workspaceId, userId, "ADMIN");

    const invitations = await prisma.workspaceInvitation.findMany({
      where: {
        workspaceId,
        status: "PENDING"
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        inviter: {
          select: {
            name: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return successResponse(invitations);
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
