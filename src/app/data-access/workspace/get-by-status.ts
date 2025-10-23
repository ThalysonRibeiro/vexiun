// actions/workspace/get-workspaces-by-status.ts (nova)
"use server";

import prisma from "@/lib/prisma";
import { withAuth } from "@/lib/errors";
import { successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors";
import { EntityStatus, Prisma } from "@/generated/prisma";

export type WorkspaceByStatus = Prisma.WorkspaceGetPayload<{
  include: {
    _count: {
      select: {
        groups: true,
        members: true,
      },
    },
    statusChanger: {
      select: {
        name: true,
        email: true
      }
    }
  },
}>

export const getWorkspacesByStatus = withAuth(
  async (userId, session, status: EntityStatus) => {
    const workspaces = await prisma.workspace.findMany({
      where: {
        userId,
        status
      },
      include: {
        _count: {
          select: {
            groups: true,
            members: true,
          },
        },
        statusChanger: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        statusChangedAt: status === 'ACTIVE' ? undefined : 'desc',
        lastActivityAt: status === 'ACTIVE' ? 'desc' : undefined
      },
    });

    return successResponse(workspaces);
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);