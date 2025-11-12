import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Deleta lidas com +30 dias
    const deletedRead = await prisma.notification.deleteMany({
      where: {
        isRead: true,
        createdAt: { lt: thirtyDaysAgo }
      }
    });

    // Deleta não lidas com +90 dias
    const deletedUnread = await prisma.notification.deleteMany({
      where: {
        isRead: false,
        createdAt: { lt: ninetyDaysAgo }
      }
    });

    // Limita a 100 notificações por usuário
    const users = await prisma.user.findMany({
      select: { id: true }
    });

    let deletedOld = 0;
    for (const user of users) {
      const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        select: { id: true }
      });

      if (notifications.length > 100) {
        const toDelete = notifications.slice(100);
        const result = await prisma.notification.deleteMany({
          where: {
            id: { in: toDelete.map((n) => n.id) }
          }
        });
        deletedOld += result.count;
      }
    }

    const total = deletedRead.count + deletedUnread.count + deletedOld;

    return NextResponse.json({
      success: true,
      deleted: {
        isRead: deletedRead.count,
        unread: deletedUnread.count,
        old: deletedOld,
        total
      }
    });
  } catch (error) {
    console.error("Erro ao limpar notificações:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
