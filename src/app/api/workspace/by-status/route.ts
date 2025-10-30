
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuthRoute } from "@/lib/api/with-auth-route";
import { EntityStatus } from "@/generated/prisma";

export const GET = withAuthRoute(async (req, userId, session) => {

  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status") as EntityStatus || "ACTIVE";

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

  return NextResponse.json({
    success: true,
    data: workspaces
  });
});