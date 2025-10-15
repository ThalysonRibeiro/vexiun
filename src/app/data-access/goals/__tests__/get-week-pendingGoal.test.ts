import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getWeekPendingGoal } from "../get-week-pendingGoal";
import { Session } from "next-auth";

// Mock dependencies
jest.mock("@/lib/auth");
jest.mock("@/lib/prisma", () => ({
  goals: {
    findMany: jest.fn(),
  },
}));

const mockAuth = auth as jest.Mock;
const mockPrismaGoalsFindMany = prisma.goals.findMany as jest.Mock;

const mockSession: Session = {
  user: { id: "user-123" },
  expires: "some-future-date",
};

describe("getWeekPendingGoal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an empty array if session is not found", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await getWeekPendingGoal(mockSession?.user?.id as string);
    expect(result).toEqual([]);
    expect(mockPrismaGoalsFindMany).not.toHaveBeenCalled();
  });

  it("should return an empty array if prisma query fails", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaGoalsFindMany.mockRejectedValue(new Error("Database error"));
    const result = await getWeekPendingGoal(mockSession?.user?.id as string);
    expect(result).toEqual([]);
  });

  it("should return formatted pending goals on success", async () => {
    mockAuth.mockResolvedValue(mockSession);
    const mockGoals = [
      {
        id: "goal-1",
        title: "Goal 1",
        desiredWeeklyFrequency: 5,
        goalCompletions: [{}, {}, {}], // 3 completions
      },
      {
        id: "goal-2",
        title: "Goal 2",
        desiredWeeklyFrequency: 2,
        goalCompletions: [], // 0 completions
      },
    ];
    mockPrismaGoalsFindMany.mockResolvedValue(mockGoals);

    const result = await getWeekPendingGoal(mockSession?.user?.id as string);

    expect(mockPrismaGoalsFindMany).toHaveBeenCalled();
    expect(result).toEqual([
      {
        id: "goal-1",
        title: "Goal 1",
        desiredWeeklyFrequency: 5,
        completionCount: 3,
      },
      {
        id: "goal-2",
        title: "Goal 2",
        desiredWeeklyFrequency: 2,
        completionCount: 0,
      },
    ]);
  });

  it("should handle goals with no completions", async () => {
    mockAuth.mockResolvedValue(mockSession);
    const mockGoals = [
      {
        id: "goal-1",
        title: "Goal 1",
        desiredWeeklyFrequency: 3,
        goalCompletions: [],
      },
    ];
    mockPrismaGoalsFindMany.mockResolvedValue(mockGoals);

    const result = await getWeekPendingGoal(mockSession?.user?.id as string);

    expect(result).toEqual([
      {
        id: "goal-1",
        title: "Goal 1",
        desiredWeeklyFrequency: 3,
        completionCount: 0,
      },
    ]);
  });
});
