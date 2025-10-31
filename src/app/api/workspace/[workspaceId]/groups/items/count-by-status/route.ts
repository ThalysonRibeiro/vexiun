import { withAuthRoute } from "@/lib/api/with-auth-route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { EntityStatus } from "@/generated/prisma";

export const GET = withAuthRoute(async (req, userId, session, context) => {
  const { workspaceId } = await context!.params!;
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status") as EntityStatus;

  const count = await prisma.item.count({
    where: {
      entityStatus: status,
      group: {
        workspaceId
      }
    }
  });

  return NextResponse.json({
    success: true,
    data: count
  });
});
