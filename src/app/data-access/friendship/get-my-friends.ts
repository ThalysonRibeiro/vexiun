"use server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AuthenticationError } from "@/lib/errors";
import { handleError, successResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";

export async function getMyFriends() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      throw new AuthenticationError();
    }

    const friends = await prisma.userFriend.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { addresseeId: userId },
        ],
      },
      include: {
        requester: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true,
          },
        },
        addressee: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        },
      },
      orderBy: {
        createdAt: "desc"
      },
    });

    //em memória
    const accepted = friends
      .filter(f => f.status === "ACCEPTED")
      .map(f => ({
        friendshipId: f.id,
        user: f.requesterId === userId ? f.addressee : f.requester,
        isRequester: f.requesterId === userId,
        createdAt: f.createdAt,
      }));

    const pending = friends
      .filter(f => f.status === "PENDING")
      .map(f => ({
        friendshipId: f.id,
        user: f.requesterId === userId ? f.addressee : f.requester,
        isRequester: f.requesterId === userId,
        createdAt: f.createdAt,
      }));

    return successResponse({
      accepted,
      pending,
    });
  } catch (error) {
    return handleError(error, ERROR_MESSAGES.GENERIC);
  };
};