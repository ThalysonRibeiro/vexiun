import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateName } from "../update-name";
import { ERROR_MESSAGES } from "@/lib/errors/messages";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock("next/cache");

const mockPrismaUserFindUnique = prisma.user.findUnique as jest.Mock;
const mockPrismaUserUpdate = prisma.user.update as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

describe("updateName Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return a validation error for a short name", async () => {
    const formData = { userId: "user-123", name: "ab" };
    const result = await updateName(formData);
    expect(result?.error).toContain("Valor muito curto");
    expect(mockPrismaUserFindUnique).not.toHaveBeenCalled();
  });

  it("should return an error if user is not found", async () => {
    mockPrismaUserFindUnique.mockResolvedValue(null);
    const formData = { userId: "non-existent-user", name: "Valid Name" };
    const result = await updateName(formData);
    expect(result).toEqual({ error: ERROR_MESSAGES.NOT_FOUND.USER });
    expect(mockPrismaUserUpdate).not.toHaveBeenCalled();
  });

  it("should update the user name and revalidate the path on success", async () => {
    const existingUser = { id: "user-123", name: "Old Name" };
    mockPrismaUserFindUnique.mockResolvedValue(existingUser);
    mockPrismaUserUpdate.mockResolvedValue({ ...existingUser, name: "New Name" });

    const formData = { userId: "user-123", name: "New Name" };
    const result = await updateName(formData);

    expect(mockPrismaUserFindUnique).toHaveBeenCalledWith({ where: { id: formData.userId } });
    expect(mockPrismaUserUpdate).toHaveBeenCalledWith({
      where: { id: formData.userId },
      data: { name: formData.name },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/profile");
    expect(result).toBeUndefined(); // No explicit success return
  });

  it("should return an error if prisma update fails", async () => {
    const existingUser = { id: "user-123", name: "Old Name" };
    mockPrismaUserFindUnique.mockResolvedValue(existingUser);
    mockPrismaUserUpdate.mockRejectedValue(new Error("Database error"));

    const formData = { userId: "user-123", name: "New Name" };
    const result = await updateName(formData);

    expect(result).toEqual({ error: "Falha ao atualizar nome" });
  });
});
