"use server";
import { ERROR_MESSAGES, successResponse, withAuth } from "@/lib/errors";
import prisma from "@/lib/prisma";

export const searchUsers = withAuth(async (userId, session, query: string) => {
  if (!query || query.trim().length < 2) {
    return successResponse([]);
  }

  const users = await prisma.user.findMany({
    where: {
      isActive: true,
      // emailVerified: { not: null },
      NOT: { id: userId },
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: query,
            mode: "insensitive"
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
}, ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR);
