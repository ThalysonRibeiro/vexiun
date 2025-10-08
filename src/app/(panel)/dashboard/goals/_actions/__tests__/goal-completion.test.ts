import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { goalCompletion } from "../goal-completion";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  goals: {
    findFirst: jest.fn(),
  },
  goalCompletions: {
    count: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock("next/cache");

const mockPrismaGoalFindFirst = prisma.goals.findFirst as jest.Mock;
const mockPrismaGoalCompletionsCount = prisma.goalCompletions.count as jest.Mock;
const mockPrismaGoalCompletionsCreate = prisma.goalCompletions.create as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

describe("goalCompletion Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a validation error for an empty goalId", async () => {
    const result = await goalCompletion({ goalId: "" });
    expect(result.error).toBeDefined();
    expect(result.error).toContain("O id da meta é obrigatório");
  });

  it("should return an error if the goal is not found", async () => {
    mockPrismaGoalFindFirst.mockResolvedValue(null);
    const result = await goalCompletion({ goalId: "non-existent-id" });
    expect(result).toEqual({ error: "Meta não encontrada." });
    expect(mockPrismaGoalCompletionsCreate).not.toHaveBeenCalled();
  });

  it("should return an error if the completion limit is reached", async () => {
    const existingGoal = { id: "goal-123", desiredWeeklyFrequency: 3, title: "Test Goal" };
    mockPrismaGoalFindFirst.mockResolvedValue(existingGoal);
    mockPrismaGoalCompletionsCount.mockResolvedValue(3); // Already completed 3 times

    const result = await goalCompletion({ goalId: "goal-123" });

    expect(result).toEqual({ error: "Limite de conclusão atingido nesta semana." });
    expect(mockPrismaGoalCompletionsCreate).not.toHaveBeenCalled();
  });

  it("should create a goal completion and revalidate the path on success", async () => {
    const existingGoal = { id: "goal-123", desiredWeeklyFrequency: 5, title: "Test Goal" };
    mockPrismaGoalFindFirst.mockResolvedValue(existingGoal);
    mockPrismaGoalCompletionsCount.mockResolvedValue(2); // Completed 2 times, can complete more
    mockPrismaGoalCompletionsCreate.mockResolvedValue({});

    const formData = { goalId: "goal-123" };
    const result = await goalCompletion(formData);

    expect(mockPrismaGoalCompletionsCreate).toHaveBeenCalledWith({
      data: { goalId: existingGoal.id },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/Workspace");
    expect(result).toEqual({ data: `Parabêns você completou a meta ${existingGoal.title}.` });
  });

  it("should return an error if prisma create fails", async () => {
    const existingGoal = { id: "goal-123", desiredWeeklyFrequency: 5, title: "Test Goal" };
    mockPrismaGoalFindFirst.mockResolvedValue(existingGoal);
    mockPrismaGoalCompletionsCount.mockResolvedValue(2);
    mockPrismaGoalCompletionsCreate.mockRejectedValue(new Error("Database error"));

    const formData = { goalId: "goal-123" };
    const result = await goalCompletion(formData);

    expect(result).toEqual({ error: "Erro ao completar meta." });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});
