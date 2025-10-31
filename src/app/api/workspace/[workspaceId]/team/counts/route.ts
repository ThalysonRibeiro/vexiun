import { withAuthRoute } from "@/lib/api/with-auth-route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = withAuthRoute(async (req, userId, session, context) => {
  const { workspaceId } = await context!.params!;

  const count = await prisma.workspaceMember.count({
    where: { workspaceId }
  });

  return NextResponse.json({
    success: true,
    data: count
  });
});
