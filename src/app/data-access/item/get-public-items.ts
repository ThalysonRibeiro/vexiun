"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthenticationError } from "@/lib/errors/custom-errors";
import { handleError, successResponse } from "@/lib/errors/error-handler";
import { validateGroupExists } from "@/lib/db/validators";
import { ERROR_MESSAGES } from "@/lib/errors/messages";

export async function getPublicItems(groupId: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    };

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

  } catch (error) {
    console.log(error);
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};