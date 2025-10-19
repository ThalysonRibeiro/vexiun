"use server";
import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";

export const getSharedWorkspaces = withAuth(
  async (userId, session) => {

    const data = await prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          select: {
            id: true,
            title: true,
            userId: true,
            createdAt: true,
            updatedAt: true,
            lastActivityAt: true,
            members: {
              select: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    image: true,
                  }
                },
                role: true
              },
            },
            _count: {
              select: {
                groups: true,
                members: true
              }
            }
          },
        },
      },
    });

    const sortedData = data.sort((a, b) =>
      b.workspace.lastActivityAt.getTime() - a.workspace.lastActivityAt.getTime()
    );

    return successResponse(sortedData);
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);