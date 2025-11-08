import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuthRoute } from "@/lib/api/with-auth-route";
import { EntityStatus } from "@/generated/prisma";

export const GET = withAuthRoute(async (req, userId, session, context) => {
  const { groupId } = await context!.params!;

  const searchParams = req.nextUrl.searchParams;
  const cursor = searchParams.get("cursor");
  const take = parseInt(searchParams.get("take") || "50");
  const status = searchParams.get("status") as EntityStatus;

  const items = await prisma.item.findMany({
    where: { groupId, entityStatus: status },
    include: {
      assignedToUser: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          createdBy: true
        }
      },
      createdByUser: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          createdBy: true
        }
      }
    },
    orderBy: {
      updatedAt: "desc"
    }
    // take,
    // ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
  });

  return NextResponse.json({
    success: true,
    data: items
  });
});
