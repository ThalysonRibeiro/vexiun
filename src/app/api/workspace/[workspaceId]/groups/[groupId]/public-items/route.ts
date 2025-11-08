import { withAuthRoute } from "@/lib/api/with-auth-route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { validateGroupExists } from "@/lib/db/validators";

export const GET = withAuthRoute(async (req, userId, session, context) => {
  const { groupId } = await context!.params!;
  await validateGroupExists(groupId);

  const response = await prisma.item.findMany({
    where: { groupId, entityStatus: "ACTIVE" },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          createdBy: true
        }
      },
      assignedToUser: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          createdBy: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const categorized = response.reduce(
    (acc, item) => {
      if (item.status !== "DONE") {
        acc.itemsNotCompleted.push(item);
      }
      switch (item.status) {
        case "DONE":
          acc.statusDone.push(item);
          break;
        case "NOT_STARTED":
          acc.statusNotStarted.push(item);
          break;
        case "IN_PROGRESS":
          acc.statusInProgress.push(item);
          break;
        case "STOPPED":
          acc.statusStoped.push(item);
          break;
      }
      return acc;
    },
    {
      itemsNotCompleted: [] as typeof response,
      statusDone: [] as typeof response,
      statusNotStarted: [] as typeof response,
      statusInProgress: [] as typeof response,
      statusStoped: [] as typeof response
    }
  );
  return NextResponse.json({
    success: true,
    data: {
      response,
      ...categorized
    }
  });
});
