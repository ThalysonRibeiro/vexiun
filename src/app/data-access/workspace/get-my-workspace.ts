"use server";
import { EntityStatus } from "@/generated/prisma";
import { ERROR_MESSAGES, successResponse, withAuth } from "@/lib/errors";
import prisma from "@/lib/prisma";

export type WorkspaceSummaryResponse = Awaited<ReturnType<typeof getMyWorkspaces>>;
export type WorkspaceSummaryData = Extract<WorkspaceSummaryResponse, { success: true }>['data'];

export const getMyWorkspaces = withAuth(async (
  userId,
  session,
  includeStatus?: EntityStatus[],
  cursor?: string,
  take = 50
) => {
  const statusFilter = includeStatus || ['ACTIVE'];

  const workspaces = await prisma.workspace.findMany({
    where: {
      userId,
      status: { in: statusFilter }
    },
    include: {
      _count: {
        select: {
          groups: { where: { status: 'ACTIVE' } },
          members: true,
        },
      },
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
        }
      }
    },
    orderBy: { lastActivityAt: "desc" },
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {})
  });

  const groupsWithCount = await prisma.group.findMany({
    where: { workspaceId: { in: workspaces.map(d => d.id) } },
    select: {
      workspaceId: true,
      _count: { select: { item: true } }
    }
  });

  const workspaceSummaries = workspaces.map(workspace => {
    const totalItems = groupsWithCount
      .filter(g => g.workspaceId === workspace.id)
      .reduce((acc, g) => acc + g._count.item, 0);

    return {
      id: workspace.id,
      title: workspace.title,
      description: workspace.description,
      categories: workspace.categories,
      statusChangedAt: workspace.statusChangedAt,
      statusChangedBy: workspace.statusChangedBy,
      lastActivityAt: workspace.lastActivityAt,
      status: workspace.status,
      groupsCount: workspace._count.groups,
      itemsCount: totalItems,
      userId: workspace.userId,
      members: workspace.members.map(m => m.user),
      menbersRole: workspace.members.find(m => m.user.id === userId)?.role,
    };
  });

  return successResponse(workspaceSummaries);
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);