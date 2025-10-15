import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateSettings } from "../update-settings";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
  },
  userSettings: {
    update: jest.fn(),
  },
}));
jest.mock("next/cache");

const mockPrismaUserFindUnique = prisma.user.findUnique as jest.Mock;
const mockPrismaSettingsUpdate = prisma.userSettings.update as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

describe("updateSettings Action", () => {
  const validFormData = {
    userId: "user-123",
    pushNotifications: true,
    emailNotifications: false,
    language: "en-US",
    timezone: "America/New_York",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if user is not found", async () => {
    mockPrismaUserFindUnique.mockResolvedValue(null);
    const result = await updateSettings(validFormData);
    expect(result).toEqual({ error: "Usuário não encontrado" });
    expect(mockPrismaSettingsUpdate).not.toHaveBeenCalled();
  });

  it("should update user settings and revalidate path on success", async () => {
    const existingUser = { id: "user-123" };
    mockPrismaUserFindUnique.mockResolvedValue(existingUser);
    mockPrismaSettingsUpdate.mockResolvedValue({});

    const result = await updateSettings(validFormData);

    expect(mockPrismaUserFindUnique).toHaveBeenCalledWith({ where: { id: validFormData.userId } });
    expect(mockPrismaSettingsUpdate).toHaveBeenCalledWith({
      where: { userId: validFormData.userId },
      data: {
        emailNotifications: validFormData.emailNotifications,
        pushNotifications: validFormData.pushNotifications,
        language: validFormData.language,
        timezone: validFormData.timezone,
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/profile");
    expect(result).toEqual({ success: "Configurações atualizadas com sucesso!" });
  });

  it("should return an error if prisma update fails", async () => {
    const existingUser = { id: "user-123" };
    mockPrismaUserFindUnique.mockResolvedValue(existingUser);
    mockPrismaSettingsUpdate.mockRejectedValue(new Error("Database error"));

    const result = await updateSettings(validFormData);

    expect(result).toEqual({ error: "Falha ao atualizar configurações" });
  });

  it("should return a validation error for invalid data", async () => {
    // Example of invalid data: language is not a string
    const invalidFormData = { ...validFormData, language: 123 };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const result = await updateSettings(invalidFormData);
    expect(result).toBeDefined();
    expect(mockPrismaUserFindUnique).not.toHaveBeenCalled();
  });
});
