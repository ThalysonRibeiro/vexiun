import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withAuthRoute } from "@/lib/api/with-auth-route";
import { validateWorkspaceAccess } from "@/lib/db/validators";

export const GET = withAuthRoute(async (req, userId, session, context) => {
  const { workspaceId } = await context!.params!;

  await validateWorkspaceAccess(workspaceId, userId);

  const response = await prisma.item.findMany({
    where: { group: { workspaceId }, entityStatus: "ACTIVE" },
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
  });

  const categorized = response.reduce(
    (acc, item) => {
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
