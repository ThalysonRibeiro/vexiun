"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getWorkspaces(cursor?: string, take = 50) {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }
  try {
    const workspaces = await prisma.workspace.findMany({
      where: { userId: session.user.id },
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

    return workspaceSummaries;

  } catch (error) {
    return [];
  }
}