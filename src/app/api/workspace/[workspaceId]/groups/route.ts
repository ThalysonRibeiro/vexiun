import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuthRoute } from "@/lib/api/with-auth-route";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { Priority, Status } from "@/generated/prisma";

export const GET = withAuthRoute(async (req, userId, session, context) => {
  // ✅ workspaceId vem do path param
  const { workspaceId } = await context!.params!;

  // ✅ cursor e take vêm dos query params
  const searchParams = req.nextUrl.searchParams;
  const cursor = searchParams.get("cursor");
  const take = parseInt(searchParams.get("take") || "50");

  // ✅ validateWorkspaceAccess já joga erro se não tiver acesso
  await validateWorkspaceAccess(workspaceId, userId);

  const group = await prisma.group.findMany({
    where: { workspaceId, status: "ACTIVE" },
    orderBy: { createdAt: "desc" }
    // take,
    // ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  if (group.length === 0) {
    return NextResponse.json({
      success: true,
      data: {
        group: [],
        itemsCompletedCount: 0,
        totalItems: 0
      }
    });
  }

  const groupIds = group.map((g) => g.id);

  // Busca todos os itens e contagens em paralelo
  const [allItems, statusCounts] = await Promise.all([
    prisma.item.findMany({
      where: {
        groupId: { in: groupIds },
        entityStatus: "ACTIVE"
      },
      select: {
        id: true,
        status: true,
        priority: true,
        groupId: true
      }
    }),
    prisma.item.groupBy({
      by: ["groupId", "status"],
      where: {
        groupId: { in: groupIds },
        entityStatus: "ACTIVE"
      },
      _count: {
        id: true
      }
    })
  ]);

  // Organiza itens por grupo
  const itemsByGroup = allItems.reduce(
    (acc, item) => {
      const groupId = item.groupId;
      if (!groupId) return acc;

      if (!acc[groupId]) {
        acc[groupId] = [];
      }
      acc[groupId].push({
        id: item.id,
        status: item.status,
        priority: item.priority
      });
      return acc;
    },
    {} as Record<string, Array<{ id: string; status: Status; priority: Priority }>>
  );

  // Organiza contagens por grupo e status
  const countsMap = statusCounts.reduce(
    (acc, item) => {
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
    },
    {} as Record<string, { done: number; pending: number; total: number }>
  );

  // Combina grupos com seus dados
  const groupsWithCounts = group.map((g) => {
    const groupId = g.id;
    const itemsArray = groupId ? itemsByGroup[groupId] || [] : [];
    const counts = groupId ? countsMap[groupId] : { done: 0, pending: 0, total: 0 };

    return {
      ...g,
      item: itemsArray,
      _count: {
        item: counts?.pending || 0
      },
      doneCount: counts?.done || 0,
      pendingCount: counts?.pending || 0,
      totalItems: counts?.total || 0
    };
  });

  // Calcula totais gerais
  const totals = groupsWithCounts.reduce(
    (acc, g) => ({
      itemsCompletedCount: acc.itemsCompletedCount + g.doneCount,
      totalItems: acc.totalItems + g.totalItems
    }),
    { itemsCompletedCount: 0, totalItems: 0 }
  );

  return NextResponse.json({
    success: true,
    data: {
      group: groupsWithCounts,
      ...totals
    }
  });
});
