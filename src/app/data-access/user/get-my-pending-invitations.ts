"use server";
import { ERROR_MESSAGES, successResponse, withAuth } from "@/lib/errors";
import prisma from "@/lib/prisma";

export const getMyPendingInvitations = withAuth(async (userId) => {
  const invitations = await prisma.workspaceInvitation.findMany({
    where: {
      userId: userId,
      status: "PENDING",
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

export const getCountMyPendingInvitations = withAuth(async (userId) => {
  const invitations = await prisma.workspaceInvitation.count({
    where: {
      userId: userId,
      status: "PENDING",
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }]
    }
  });

  return successResponse(invitations);
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);

export const getWorkspacePendingInvitations = withAuth(async (userId, session) => {
  const invitations = await prisma.workspaceInvitation.findMany({
    where: {
      status: "PENDING",
      workspace: {
        members: {
          some: { userId, role: "OWNER" }
        }
      }
    },
    include: {
      workspace: {
        select: {
          id: true,
          title: true
        }
      },
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
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
