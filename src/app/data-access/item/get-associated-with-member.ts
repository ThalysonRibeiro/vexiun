"use server";

import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/errors";
import { NotFoundError } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";

export const getAssociatedWithMember = withAuth(
  async (userId, session, workspaceId: string, memberId: string, take = 100) => {
    const member = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: memberId,
        },
      },
      select: { joinedAt: true, }
    });

    if (!member) {
      throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.ITEM);
    }

    const items = await prisma.item.findMany({
      where: {
        assignedTo: memberId,
        group: {
          workspaceId
        },
        entityStatus: "ACTIVE"
      },
      select: {
        id: true,
        title: true,
        assignedTo: true,
        status: true,
        priority: true,
        term: true
      },
      take,
      orderBy: { updatedAt: "desc" }
    });

    return successResponse({ member, items });
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);