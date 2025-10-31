"use server";
import { EntityStatus } from "@/generated/prisma";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { ERROR_MESSAGES, PermissionError, successResponse, withAuth } from "@/lib/errors";
import prisma from "@/lib/prisma";

export const getItemsByEntityStatus = withAuth(
  async (userId, session, groupId: string, status: EntityStatus) => {
    const response = await prisma.item.findMany({
      where: { groupId, entityStatus: status },
      include: {
        assignedToUser: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            createdBy: true
          }
        },
        createdByUser: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
            createdBy: true
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      }
    });

    return successResponse({
      response
    });
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
