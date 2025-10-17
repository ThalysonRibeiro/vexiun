"use server";
import { validateGroupExists } from "@/lib/db/validators";
import { ERROR_MESSAGES, successResponse, withAuth } from "@/lib/errors";
import prisma from "@/lib/prisma";

export const getPublicItems = withAuth(async (
  userId,
  session,
  groupId: string) => {

  if (!groupId) {
    return successResponse({
      response: [],
      itemsNotCompleted: [],
      statusDone: [],
      statusNotStarted: [],
      statusInProgress: [],
      statusStoped: []
    });
  };
  await validateGroupExists(groupId);

  const response = await prisma.item.findMany({
    where: { groupId },
    include: {
      createdByUser: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          createdBy: true,
        }
      },
      assignedToUser: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          createdBy: true,
        }
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const categorized = response.reduce((acc, item) => {
    if (item.status !== "DONE") {
      acc.itemsNotCompleted.push(item);
    }
    switch (item.status) {
      case "DONE":
        acc.statusDone.push(item)
        break;
      case "NOT_STARTED":
        acc.statusNotStarted.push(item)
        break;
      case "IN_PROGRESS":
        acc.statusInProgress.push(item)
        break;
      case "STOPPED":
        acc.statusStoped.push(item)
        break;
    }
    return acc;
  }, {
    itemsNotCompleted: [] as typeof response,
    statusDone: [] as typeof response,
    statusNotStarted: [] as typeof response,
    statusInProgress: [] as typeof response,
    statusStoped: [] as typeof response,
  });

  return successResponse({
    response,
    ...categorized,
  });
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);