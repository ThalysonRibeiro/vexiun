"use server";
import { ERROR_MESSAGES, successResponse, withAuth } from "@/lib/errors";
import prisma from "@/lib/prisma";

export const getItemsAssignedToUser = withAuth(async (
  userId,
  session,
  assignedTo: string) => {

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
  });
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);