import { withAuthRoute } from "@/lib/api/with-auth-route";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = withAuthRoute(async (req, userId, session) => {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("query") as string;

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

  return NextResponse.json({
    success: true,
    data: users
  });
});
