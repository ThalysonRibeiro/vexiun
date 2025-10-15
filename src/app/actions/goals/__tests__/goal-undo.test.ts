import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { goalUndo } from "../undo";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  goalCompletions: {
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock("next/cache");

const mockPrismaGoalCompletionsFindFirst = prisma.goalCompletions.findFirst as jest.Mock;
const mockPrismaGoalCompletionsDelete = prisma.goalCompletions.delete as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

describe("goalUndo Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a validation error for an empty id", async () => {
    const result = await goalUndo({ id: "" });
    expect(result.error).toBeDefined();
    expect(result.error).toContain("O id é obrigatório");
  });

  it("should return an error if the goal completion is not found", async () => {
    mockPrismaGoalCompletionsFindFirst.mockResolvedValue(null);
    const result = await goalUndo({ id: "non-existent-id" }); // Assign result here
    expect(result).toEqual({ error: "Erro ao completar meta" });
    expect(mockPrismaGoalCompletionsDelete).not.toHaveBeenCalled();
  });

  it("should delete the goal completion and revalidate the path on success", async () => {
    const existingCompletion = { id: "completion-123" };
    mockPrismaGoalCompletionsFindFirst.mockResolvedValue(existingCompletion);
    mockPrismaGoalCompletionsDelete.mockResolvedValue({});

    const formData = { id: "completion-123" };
    const result = await goalUndo(formData);

    expect(mockPrismaGoalCompletionsFindFirst).toHaveBeenCalledWith({ where: { id: formData.id } });
    expect(mockPrismaGoalCompletionsDelete).toHaveBeenCalledWith({ where: { id: existingCompletion.id } });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/Workspace");
    expect(result).toEqual({ data: "Desfeita" });
  });

  it("should return an error if prisma delete fails", async () => {
    const existingCompletion = { id: "completion-123" };
    mockPrismaGoalCompletionsFindFirst.mockResolvedValue(existingCompletion);
    mockPrismaGoalCompletionsDelete.mockRejectedValue(new Error("Database error"));

    const formData = { id: "completion-123" };
    const result = await goalUndo(formData);

    expect(result).toEqual({ error: "Erro ao completar meta" });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});