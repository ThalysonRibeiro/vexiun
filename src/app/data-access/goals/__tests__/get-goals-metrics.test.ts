import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Goals, GoalCompletions } from "@/generated/prisma";
import { getGoalsMetrics } from "../get-metrics";
import { Session } from "next-auth";

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}));

const prismaMock = {
  goals: {
    findMany: jest.fn(),
  },
};

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: prismaMock,
}));


// Use a mocked-typed prisma for TS to accept jest mocks
const prismaMocked = prisma as unknown as typeof prismaMock;

const mockSession: Session = {
  user: { id: "user-123" },
  expires: "some-future-date",
};

describe("getGoalsMetrics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    prismaMocked.goals.findMany.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    (console.error as jest.Mock).mockRestore();
  });

  it("should return null if user is not authenticated", async () => {
    mockSession.mockResolvedValue(null);
    const result = await getGoalsMetrics(mockSession.user?.id as string);
    expect(result).toBeNull();
  });

  it("should return null if user has no goals", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    prismaMocked.goals.findMany.mockResolvedValue([]);
    const result = await getGoalsMetrics();
    expect(result).toBeNull();
  });

  it("should return null if there are no goal completions", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    prismaMocked.goals.findMany.mockResolvedValue([
      { id: "goal-1", userId: "user-1", title: "Test Goal", desiredWeeklyFrequency: 3, createdAt: new Date(), updatedAt: new Date(), goalCompletions: [] },
    ]);
    const result = await getGoalsMetrics();
    expect(result).toBeNull();
  });

  it("should return null on database error", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    const dbError = new Error("DB Error");
    prismaMocked.goals.findMany.mockRejectedValue(dbError);
    const result = await getGoalsMetrics();
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalledWith(expect.any(Error));
  });

  it("should calculate and return metrics correctly", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const goals: (Goals & { goalCompletions: GoalCompletions[] })[] = [
      {
        id: "goal-1",
        userId: "user-1",
        title: "Read book",
        desiredWeeklyFrequency: 2,
        createdAt: new Date("2023-08-01T00:00:00Z"),
        updatedAt: new Date("2023-08-01T00:00:00Z"),
        goalCompletions: [
          { id: "gc-1", goalId: "goal-1", createdAt: new Date("2023-08-21T10:00:00Z"), updatedAt: new Date() },
          { id: "gc-2", goalId: "goal-1", createdAt: new Date("2023-08-22T10:00:00Z"), updatedAt: new Date() },
          { id: "gc-3", goalId: "goal-1", createdAt: new Date("2023-08-28T10:00:00Z"), updatedAt: new Date() },
        ],
      },
    ];

    prismaMocked.goals.findMany.mockResolvedValue(goals);

    const result = await getGoalsMetrics();

    const week1Label = "21/08";
    const week2Label = "28/08";

    expect(result).not.toBeNull();

    expect(result?.weeklyProgress).toEqual([
      { week: week1Label, completed: 2, total: 2 },
      { week: week2Label, completed: 1, total: 2 },
    ]);

    expect(result?.completedWeeks).toEqual([week1Label]);
    expect(result?.incompletedWeeks).toEqual([week2Label]);

    const augustProgress = result?.monthlyProgress[7];
    expect(augustProgress?.month).toBe("August");
    expect(augustProgress?.completed).toBe(3);
    expect(augustProgress?.total).toBe(8);
  });
});