
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { Session } from "next-auth";
import { createGoal } from "../create";

// Mock dependencies
jest.mock("@/lib/auth");
jest.mock("@/lib/prisma", () => ({
  goals: {
    create: jest.fn(),
  },
}));
jest.mock("next/cache");

const mockAuth = auth as jest.Mock;
const mockPrismaGoalCreate = prisma.goals.create as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

const mockSession: Session = {
  user: { id: "user-123" },
  expires: "some-future-date",
};

describe("createGoal Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if session is not found", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await createGoal({ title: "Test Goal", desiredWeeklyFrequency: 3 });
    expect(result).toEqual({ error: "Falha ao cadastrar Meta" });
    expect(mockPrismaGoalCreate).not.toHaveBeenCalled();
  });

  it("should return a validation error for an empty title", async () => {
    mockAuth.mockResolvedValue(mockSession);
    const result = await createGoal({ title: "", desiredWeeklyFrequency: 3 });
    expect(result.error).toBeDefined();
    expect(result.error).toContain("Informe a atividade qeu deseja realizar");
  });

  it("should return a validation error for frequency greater than 7", async () => {
    mockAuth.mockResolvedValue(mockSession);
    const result = await createGoal({ title: "Test Goal", desiredWeeklyFrequency: 8 });
    expect(result.error).toBeDefined();
    expect(result.error).toContain("Number must be less than or equal to 7");
  });

  it("should return a validation error for frequency less than 1", async () => {
    mockAuth.mockResolvedValue(mockSession);
    const result = await createGoal({ title: "Test Goal", desiredWeeklyFrequency: 0 });
    expect(result.error).toBeDefined();
    expect(result.error).toContain("Number must be greater than or equal to 1");
  });

  it("should create a goal and revalidate the path on success", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaGoalCreate.mockResolvedValue({
      id: "goal-1",
      userId: "user-123",
      title: "Test Goal",
      desiredWeeklyFrequency: 3,
    });

    const formData = { title: "Test Goal", desiredWeeklyFrequency: 3 };
    const result = await createGoal(formData);

    expect(mockPrismaGoalCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-123",
        title: formData.title,
        desiredWeeklyFrequency: formData.desiredWeeklyFrequency,
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/Workspace");
    expect(result).toEqual({ data: "Meta cadastrada com sucesso!" });
  });

  it("should return an error if prisma create fails", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaGoalCreate.mockRejectedValue(new Error("Database error"));

    const formData = { title: "Test Goal", desiredWeeklyFrequency: 5 };
    const result = await createGoal(formData);

    expect(result).toEqual({ error: "Falha ao cadastrar Meta" });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});
