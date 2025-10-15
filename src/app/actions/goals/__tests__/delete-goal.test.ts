import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteGoal } from "../delete";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  goals: {
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("next/cache");

const mockPrismaGoalFindFirst = prisma.goals.findFirst as jest.Mock;
const mockPrismaGoalDelete = prisma.goals.delete as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

describe("deleteGoal Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a validation error for an empty goalId", async () => {
    const result = await deleteGoal({ goalId: "" });
    expect(result.error).toBeDefined();
    expect(result.error).toContain("O id da meta é obrigatório");
  });

  it("should return an error if the goal is not found", async () => {
    mockPrismaGoalFindFirst.mockResolvedValue(null);
    const result = await deleteGoal({ goalId: "non-existent-id" });
    expect(result).toEqual({ error: "Falha ao deletar Meta" });
    expect(mockPrismaGoalDelete).not.toHaveBeenCalled();
  });

  it("should delete the goal and revalidate the path on success", async () => {
    const existingGoal = { id: "goal-123" };
    mockPrismaGoalFindFirst.mockResolvedValue(existingGoal);
    mockPrismaGoalDelete.mockResolvedValue({});

    const formData = { goalId: "goal-123" };
    const result = await deleteGoal(formData);

    expect(mockPrismaGoalFindFirst).toHaveBeenCalledWith({ where: { id: formData.goalId } });
    expect(mockPrismaGoalDelete).toHaveBeenCalledWith({ where: { id: existingGoal.id } });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/Workspace");
    expect(result).toEqual({ data: "Meta deletada com sucesso!" });
  });

  it("should return an error if prisma delete fails", async () => {
    const existingGoal = { id: "goal-123" };
    mockPrismaGoalFindFirst.mockResolvedValue(existingGoal);
    mockPrismaGoalDelete.mockRejectedValue(new Error("Database error"));

    const formData = { goalId: "goal-123" };
    const result = await deleteGoal(formData);

    expect(result).toEqual({ error: "Falha ao deletar Meta" });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});
