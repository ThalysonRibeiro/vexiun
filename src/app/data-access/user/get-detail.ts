"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthenticationError } from "@/lib/errors/custom-errors";
import { handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";

export async function getDetailUser() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: { select: { sessions: true, } },
        goals: {
          include: {
            goalCompletions: true
          }
        },
        userSettings: true,
      }
    });
    return successResponse(user);
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};