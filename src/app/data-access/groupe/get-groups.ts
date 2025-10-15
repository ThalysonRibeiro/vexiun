"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthenticationError, PermissionError } from "@/lib/errors";
import { handleError, successResponse } from "@/utils/error-handler";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { Status } from "@/generated/prisma";

export async function getGroups(workspaceId: string, cursor?: string, take = 50) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }

    if (!workspaceId) {
      return successResponse({
        group: [],
        itemsCompletedCount: 0,
        totalItems: 0,
      });
    }

    const hasAccess = await validateWorkspaceAccess(workspaceId, userId);

    if (!hasAccess) {
      throw new PermissionError(ERROR_MESSAGES.PERMISSION.NO_ACCESS);
    }

    // Busca os grupos
    const group = await prisma.group.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      take,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });

    if (group.length === 0) {
      return successResponse({
        group: [],
        itemsCompletedCount: 0,
        totalItems: 0,
      });
    }

    const groupIds = group.map(g => g.id);

    // Busca todos os itens e contagens em paralelo
    const [allItems, statusCounts] = await Promise.all([
      // Busca TODOS os itens com id e status
      prisma.item.findMany({
        where: {
          groupId: { in: groupIds }
        },
        select: {
          id: true,
          status: true,
          groupId: true
        }
      }),
      // Busca contagens por status
      prisma.item.groupBy({
        by: ["groupId", "status"],
        where: {
          groupId: { in: groupIds }
        },
        _count: {
          id: true
        }
      })
    ]);

    // Organiza itens por grupo
    const itemsByGroup = allItems.reduce((acc, item) => {
      const groupId = item.groupId;
      if (!groupId) return acc;

      if (!acc[groupId]) {
        acc[groupId] = [];
      }
      acc[groupId].push({ id: item.id, status: item.status });
      return acc;
    }, {} as Record<string, Array<{ id: string; status: Status }>>);

    // Organiza contagens por grupo e status
    const countsMap = statusCounts.reduce((acc, item) => {
      const groupId = item.groupId;
      if (!groupId) return acc;

      if (!acc[groupId]) {
        acc[groupId] = { done: 0, pending: 0, total: 0 };
      }

      const count = item._count.id;
      acc[groupId].total += count;

      if (item.status === "DONE") {
        acc[groupId].done = count;
      } else if (["IN_PROGRESS", "NOT_STARTED", "STOPPED"].includes(item.status)) {
        acc[groupId].pending += count;
      }

      return acc;
    }, {} as Record<string, { done: number; pending: number; total: number }>);

    // Combina grupos com seus dados
    const groupsWithCounts = group.map(g => {
      const groupId = g.id;
      const itemsArray = groupId ? (itemsByGroup[groupId] || []) : [];
      const counts = groupId ? countsMap[groupId] : { done: 0, pending: 0, total: 0 };

      return {
        ...g,
        item: itemsArray,
        _count: {
          item: counts?.pending || 0
        },
        doneCount: counts?.done || 0,
        pendingCount: counts?.pending || 0,
        totalItems: counts?.total || 0,
      };
    });

    // Calcula totais gerais
    const totals = groupsWithCounts.reduce(
      (acc, g) => ({
        itemsCompletedCount: acc.itemsCompletedCount + g.doneCount,
        totalItems: acc.totalItems + g.totalItems,
      }),
      { itemsCompletedCount: 0, totalItems: 0 }
    );

    return successResponse({
      group: groupsWithCounts,
      ...totals,
    });
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  }
}