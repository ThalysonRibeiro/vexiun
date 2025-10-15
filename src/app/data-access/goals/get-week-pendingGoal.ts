"use server"
import prisma from "@/lib/prisma";
import { endOfWeek, startOfWeek } from "date-fns";

export type PendingGoal = {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
};

export async function getWeekPendingGoal(userId: string): Promise<PendingGoal[] | null> {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 })

  try {
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
              lte: weekEnd,
            }
          }
        }
      }
    });
    const formattedGoals: PendingGoal[] = goals.map(goal => ({
      id: goal.id,
      title: goal.title,
      desiredWeeklyFrequency: goal.desiredWeeklyFrequency,
      completionCount: goal.goalCompletions.length
    }));
    return formattedGoals;
  } catch (error) {
    return null
  }
}
