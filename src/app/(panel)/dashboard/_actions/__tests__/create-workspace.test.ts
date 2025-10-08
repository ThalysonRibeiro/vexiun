import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { revalidatePath } from "next/cache";
import { createWorkspace } from "../create-workspace";
import prisma from "@/lib/prisma";


jest.mock("@/lib/auth");
jest.mock("@/lib/prisma", () => ({
  Workspace: {
    create: jest.fn(),
  },
}));
jest.mock("next/cache");

const mockAuth = auth as jest.Mock;
const mockPrismaWorkspaceCreate = prisma.workspace.create as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

const formData = { title: "test Workspace" };

const mockSession: Session = {
  user: { id: "user-123" },
  expires: "some-future-date",
};

describe("create Workspace Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if session is not found", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await createWorkspace({ title: "test Workspace" });
    expect(result).toEqual({ error: "Falha ao cadastrar Workspace" });
    expect(mockPrismaWorkspaceCreate).not.toHaveBeenCalled();
  });

  it("should return a validation error for an empty title", async () => {
    mockAuth.mockResolvedValue(mockSession);
    const result = await createWorkspace({ title: "" });
    expect(result.error).toBeDefined();
    expect(result.error).toContain("O titulo é obrigatório");
  });

  it("should create a Workspace and revalidate the path on success", async () => {
    const newWorkspace = {
      id: "Workspace-1",
      userId: "user-123",
      title: "test Workspace",
    };
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaWorkspaceCreate.mockResolvedValue(newWorkspace);

    const result = await createWorkspace(formData);

    expect(mockPrismaWorkspaceCreate).toHaveBeenCalledWith({
      data: {
        userId: "user-123",
        title: "test Workspace",
      },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(result).toEqual({ newWorkspace });
  });
  it("should return an error if prisma create fails", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaWorkspaceCreate.mockRejectedValue(new Error("Database error"));

    const result = await createWorkspace(formData);

    expect(result).toEqual({ error: "Falha ao cadastrar Workspace" });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});