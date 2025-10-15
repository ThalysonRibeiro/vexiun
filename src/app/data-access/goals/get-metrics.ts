"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Goals, GoalCompletions } from "@/generated/prisma";
import { GoalMetrics } from "@/app/(panel)/dashboard/goals/metrics/_types";
// Avoid external date-fns to reduce test environment flakiness

function getMondayStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun,1=Mon,...
  const diffToMonday = (day + 6) % 7; // 0 if Monday
  const monday = new Date(d);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - diffToMonday);
  return monday;
}

function getSundayEnd(mondayStart: Date): Date {
  const end = new Date(mondayStart);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

function formatDayMonth(date: Date): string {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${d}/${m}`;
}

function monthLabel(index: number): string {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[index];
}

export async function getGoalsMetrics(userId: string): Promise<GoalMetrics | null> {

  try {
    const goalsResult = await prisma.goals.findMany({
      where: { userId },
      include: {
        goalCompletions: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    const goals = Array.isArray(goalsResult) ? goalsResult : [];
    if (goals.length === 0) {
      return null;
    }

    const allCompletions = goals.reduce<{ createdAt: Date }[]>((acc, g: Goals & { goalCompletions: GoalCompletions[] }) => {
      const completions = Array.isArray(g.goalCompletions) ? g.goalCompletions : [];
      if (completions.length > 0) {
        for (const c of completions) {
          acc.push({ createdAt: new Date(c.createdAt) });
        }
      }
      return acc;
    }, []);
    if (allCompletions.length === 0) {
      return null;
    }
    const firstCompletionDate = allCompletions[0].createdAt;
    const lastCompletionDate = allCompletions[allCompletions.length - 1].createdAt;

    const weeks: Date[] = [];
    let cursor = getMondayStart(firstCompletionDate);
    const last = getMondayStart(lastCompletionDate);
    while (cursor.getTime() <= last.getTime()) {
      weeks.push(new Date(cursor));
      const next = new Date(cursor);
      next.setDate(next.getDate() + 7);
      cursor = next;
    }

    const weeklyProgress = weeks.map((weekStart) => {
      const weekEnd = getSundayEnd(weekStart);
      const weekLabel = formatDayMonth(weekStart);

      let completed = 0;
      let total = 0;

      goals.forEach((goal) => {
        const completionsInWeek = goal.goalCompletions.filter(
          (c) => c.createdAt >= weekStart && c.createdAt <= weekEnd
        ).length;
        completed += completionsInWeek;
        total += goal.desiredWeeklyFrequency;
      });

      return { week: weekLabel, completed, total };
    });

    const completedWeeks: string[] = [];
    const incompletedWeeks: string[] = [];

    weeklyProgress.forEach((weekData) => {
      if (weekData.completed >= weekData.total) {
        completedWeeks.push(weekData.week);
      } else {
        incompletedWeeks.push(weekData.week);
      }
    });

    const monthlyProgress = Array.from({ length: 12 }).map((_, i) => {
      const label = monthLabel(i);
      let completed = 0;
      let total = 0;

      goals.forEach((goal) => {
        const completionsInMonth = goal.goalCompletions.filter(
          (c) => new Date(c.createdAt).getMonth() === i
        ).length;
        completed += completionsInMonth;
        total += goal.desiredWeeklyFrequency * 4; // Approximate monthly frequency
      });

      return { month: label, completed, total };
    });

    return {
      weeklyProgress,
      monthlyProgress,
      completedWeeks,
      incompletedWeeks,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
}
