"use server";

import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";
import { EntityStatus } from "@/generated/prisma";

export const getGroupItemByEntityStatus = withAuth(
  async (userId, session, workspaceId: string, status: EntityStatus) => {
    const data = await prisma.group.findMany({
      where: {
        workspaceId,
        item: {
          some: {
            entityStatus: status
          }
        }
      },
      include: {
        item: {
          where: { entityStatus: status },
          include: {
            assignedToUser: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
                createdBy: true,
              },
            },
            createdByUser: {
              select: {
                id: true,
                name: true,
                image: true,
                email: true,
                createdBy: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          }
        },
      },
      orderBy: {
        updatedAt: "desc",
      }
    });

    return successResponse(data);
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);