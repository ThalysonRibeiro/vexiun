import { Prisma } from "@/generated/prisma";

export type UserWithCounts = Prisma.UserGetPayload<{
  include: {
    _count: { select: { sessions: true } };
    goals: {
      include: { goalCompletions: true };
    };
    userSettings: true;
  };
}>;
