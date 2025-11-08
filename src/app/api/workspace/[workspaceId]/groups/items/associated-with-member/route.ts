import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuthRoute } from "@/lib/api/with-auth-route";
import { ERROR_MESSAGES, NotFoundError } from "@/lib/errors";

export const GET = withAuthRoute(async (req, userId, session, context) => {
  const { workspaceId } = await context!.params!;

  const searchParams = req.nextUrl.searchParams;
  const cursor = searchParams.get("cursor");
  const take = parseInt(searchParams.get("take") || "50");
  const memberId = searchParams.get("memberId")!;

  const member = await prisma.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId,
        userId: memberId
      }
    },
    select: { joinedAt: true }
  });

  if (!member) {
    throw new NotFoundError(ERROR_MESSAGES.NOT_FOUND.ITEM);
  }

  const items = await prisma.item.findMany({
    where: {
      assignedTo: memberId,
      group: {
        workspaceId
      },
      entityStatus: "ACTIVE"
    },
    select: {
      id: true,
      title: true,
      assignedTo: true,
      status: true,
      priority: true,
      term: true
    },
    orderBy: { updatedAt: "desc" }
    // take,
    // ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  return NextResponse.json({
    success: true,
    data: {
      member,
      items
    }
  });
});
