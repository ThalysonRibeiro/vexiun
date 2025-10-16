"use server";
import { auth } from "@/lib/auth";
import { AuthenticationError } from "@/lib/errors/custom-errors";
import prisma from "@/lib/prisma";
import { handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";

export async function getItemsAssignedToUser(assignedTo: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    };

    if (!assignedTo) {
      return successResponse(null);
    };

    const itemsAssigned = await prisma.item.findMany({
      where: {
        assignedTo,
      },
      orderBy: [
        { term: "asc" },
        { priority: "asc" },
        { status: "asc" },
      ]
    });

    const stats = {
      done: itemsAssigned.filter(t => t.status === "DONE").length,
      pending: itemsAssigned.filter(t => t.status === "IN_PROGRESS").length,
      stopped: itemsAssigned.filter(t => t.status === "STOPPED").length,
      notStarted: itemsAssigned.filter(t => t.status === "NOT_STARTED").length,
      total: itemsAssigned.length,
    }

    return successResponse({
      success: true,
      itemsAssigned,
      stats
    })
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  }
}