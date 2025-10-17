"use server";
import { ERROR_MESSAGES, successResponse, withAuth } from "@/lib/errors";
import prisma from "@/lib/prisma";

export type WorkspaceSummaryResponse = Awaited<ReturnType<typeof getMyWorkspaces>>;
export type WorkspaceSummaryData = Extract<WorkspaceSummaryResponse, { success: true }>['data']

export const getMyWorkspaces = withAuth(async (
  userId,
  session,
  cursor?: string, take = 50) => {

  const workspaces = await prisma.workspace.findMany({
    where: { userId },
    include: {
      _count: {
        select: {
          groups: true,
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
          }
        }
      }
    },
    orderBy: { createdAt: "desc" },
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
      groupsCount: workspace._count.groups,
      itemsCount: totalItems,
      members: workspace.members.map(m => m.user)
    };
  });

  return successResponse(workspaceSummaries);
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);