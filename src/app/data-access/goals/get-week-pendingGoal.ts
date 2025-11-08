"use server";
import { ActionResponse, ERROR_MESSAGES, successResponse, withErrorHandler } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { endOfWeek, startOfWeek } from "date-fns";

export type PendingGoal = {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
};

export const getWeekPendingGoal = withErrorHandler(
  async (userId: string): Promise<ActionResponse<PendingGoal[] | null>> => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const goals = await prisma.goals.findMany({
      where: {
        userId: userId,
        createdAt: {
          lte: weekEnd
        }
      },
      include: {
        goalCompletions: {
          where: {
            createdAt: {
              gte: weekStart,
              lte: weekEnd
            }
          }
        }
      }
    });
    const formattedGoals: PendingGoal[] = goals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
      completionCount: goal.goalCompletions.length
    }));
    return successResponse(formattedGoals);
  },
  ERROR_MESSAGES.GENERIC.UNKNOWN_ERROR
);
