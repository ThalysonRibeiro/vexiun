"use server"

import prisma from "@/lib/prisma";

export async function getGroups(workspaceId: string, cursor?: string, take = 50) {
  if (!workspaceId) return [];

  try {
    return await prisma.group.findMany({
      where: { workspaceId },
      include: {
        item: {
          select: {
            id: true,
            title: true,
            term: true,
            priority: true,
            status: true,
            notes: true,
            description: true,
            createdBy: true,
            assignedTo: true,
            createdByUser: true,
            assignedToUser: true,
          },
          // take: 20, // Limita 20 items por group
          orderBy: { createdAt: "desc" }
        },
      },
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {})
    });
  } catch {
    return [];
  }
}