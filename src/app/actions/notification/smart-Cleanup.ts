"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { ActionResponse, handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { AuthenticationError } from "@/lib/errors";

export async function smartCleanup(): Promise<ActionResponse<{
  deleted: {
    isRead: number,
    unread: number,
    old: number,
    total: number
  }
}>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    // Deleta lidas com +30 dias
    const deletedRead = await prisma.notification.deleteMany({
      where: {
        userId: userId,
        isRead: true,
        createdAt: { lt: thirtyDaysAgo },
      },
    });

    // Deleta não lidas com +90 dias
    const deletedUnread = await prisma.notification.deleteMany({
      where: {
        userId: userId,
        isRead: false,
        createdAt: { lt: ninetyDaysAgo },
      },
    });

    // Mantém apenas as 100 mais recentes
    const allNotifications = await prisma.notification.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
      select: { id: true },
    });

    let deletedOld = 0;
    if (allNotifications.length > 100) {
      const toDelete = allNotifications.slice(100);
      const result = await prisma.notification.deleteMany({
        where: {
          id: { in: toDelete.map(n => n.id) },
        },
      });
      deletedOld = result.count;
    };

    const totalDeleted = deletedRead.count + deletedUnread.count + deletedOld;

    revalidatePath("/dashboard/notifications");

    return successResponse({
      deleted: {
        isRead: deletedRead.count,
        unread: deletedUnread.count,
        old: deletedOld,
        total: totalDeleted
      }
    })
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};