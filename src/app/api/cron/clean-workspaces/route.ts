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

    const result = await prisma.$transaction(async (tx) => {
      // 1. Buscar workspaces a deletar
      const workspaces = await tx.workspace.findMany({
        where: {
          status: "DELETED",
          lastActivityAt: { lt: thirtyDaysAgo }
        },
        select: { id: true }
      });

      const workspaceIds = workspaces.map((w) => w.id);

      if (workspaceIds.length === 0) {
        return { workspaces: 0, notifications: 0 };
      }

      // 2. Limpar notificações relacionadas aos workspaces
      const deletedNotifications = await tx.notification.deleteMany({
        where: {
          referenceId: { in: workspaceIds },
          type: {
            in: ["WORKSPACE_INVITE", "WORKSPACE_ACCEPTED"]
          }
        }
      });

      // 3. Deletar workspaces (cascade deleta: members, invitations, chats, groups, items)
      const deletedWorkspaces = await tx.workspace.deleteMany({
        where: { id: { in: workspaceIds } }
      });

      return {
        workspaces: deletedWorkspaces.count,
        notifications: deletedNotifications.count
      };
    });

    return NextResponse.json({
      success: true,
      message: `${result.workspaces} workspace(s) e ${result.notifications} notificação(ões) deletados`
    });
  } catch (error) {
    console.error("Erro ao limpar workspaces:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
