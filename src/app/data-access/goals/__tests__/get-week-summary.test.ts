import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Session } from "next-auth";
import { getWeekSummary } from "../get-week-summary";

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

// To control the current date in tests
const MOCK_DATE = new Date("2024-07-24T10:00:00.000Z"); // A Wednesday

describe("GetWeekSummary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_DATE);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return an error if session is not found", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await getWeekSummary(mockSession?.user?.id as string);
    expect(result).toEqual({ error: "Nenhum meta completa" });
  });

  it("should return an error if prisma query fails", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaGoalsFindMany.mockRejectedValue(new Error("Database error"));
    const result = await getWeekSummary(mockSession?.user?.id as string);
    expect(result).toEqual({ error: "Nenhum meta completa" });
  });

  it("should return a summary with zero values if there are no goals", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaGoalsFindMany.mockResolvedValue([]);

    const result = await getWeekSummary(mockSession?.user?.id as string);

    expect(result.summary?.completed).toBe(0);
    expect(result.summary?.total).toBe(0);
    expect(result.summary?.goalsPerDay.every(day => day.goals.length === 0)).toBe(true);
  });

  it("should correctly calculate summary and group goals by day", async () => {
    mockAuth.mockResolvedValue(mockSession);
    const mockGoals = [
      {
        id: "goal-1",
        title: "Goal 1",
        desiredWeeklyFrequency: 5,
        goalCompletions: [
          { id: "c1", goal: { title: "Goal 1" }, createdAt: new Date("2024-07-22T10:00:00Z") }, // Monday
          { id: "c2", goal: { title: "Goal 1" }, createdAt: new Date("2024-07-24T09:00:00Z") }, // Wednesday
        ],
      },
      {
        id: "goal-2",
        title: "Goal 2",
        desiredWeeklyFrequency: 3,
        goalCompletions: [
          { id: "c3", goal: { title: "Goal 2" }, createdAt: new Date("2024-07-24T11:00:00Z") }, // Wednesday
        ],
      },
    ];
    mockPrismaGoalsFindMany.mockResolvedValue(mockGoals);

    const result = await getWeekSummary(mockSession?.user?.id as string);

    expect(result.summary?.completed).toBe(3);
    expect(result.summary?.total).toBe(8); // 5 + 3

    const wednesdayData = result.summary?.goalsPerDay.find(d => d.dayOfWeek === "Quarta-feira");
    expect(wednesdayData?.goals).toHaveLength(2);

    const mondayData = result.summary?.goalsPerDay.find(d => d.dayOfWeek === "Segunda-feira");
    expect(mondayData?.goals).toHaveLength(1);
  });

  it("should order days of the week starting from the current day", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaGoalsFindMany.mockResolvedValue([]);

    const result = await getWeekSummary(mockSession?.user?.id as string);

    // MOCK_DATE is a Wednesday ("Quarta-feira")
    expect(result.summary?.goalsPerDay[0].dayOfWeek).toBe("Quarta-feira");
    expect(result.summary?.goalsPerDay[1].dayOfWeek).toBe("Quinta-feira");
    expect(result.summary?.goalsPerDay[6].dayOfWeek).toBe("Terça-feira");
  });
});
