"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthenticationError } from "@/lib/errors/custom-errors";
import { handleError, successResponse } from "@/lib/errors/error-handler";
import { ERROR_MESSAGES } from "@/lib/errors/messages";

export async function searchUsers(query: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    };


    if (!query || query.trim().length < 2) {
      return successResponse([]);
    };

    const users = await prisma.user.findMany({
      where: {
        isActive: true,
        // emailVerified: { not: null },
        NOT: { id: userId },
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      },
      take: 20
    });

    return successResponse(users);
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};;