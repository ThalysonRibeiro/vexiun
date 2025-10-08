"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function getUserFriend() {
  const session = await auth();
  if (!session?.user) {
    return {
      accepted: [],
      pending: [],
      error: "Usuário não autenticado",
    };
  };


  try {
    const userId = session?.user.id;

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

    return {
      accepted,
      pending,
    };
  } catch (error) {
    return {
      accepted: [],
      pending: [],
      error
    };
  }

};