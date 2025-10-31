"use server";
import { ERROR_MESSAGES, successResponse, withAuth } from "@/lib/errors";
import prisma from "@/lib/prisma";

export const getDetailUser = withAuth(async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { sessions: true } },
      goals: {
        include: {
          goalCompletions: true
        }
      },
      userSettings: true
    }
  });
  return successResponse(user);
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
