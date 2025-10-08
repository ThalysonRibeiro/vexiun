import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateWorkspace } from "../update-workspace";


jest.mock('@/lib/prisma', () => ({
  Workspace: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock('next/cache');

const mockPrismaWorkspaceFindFirst = prisma.workspace.findFirst as jest.Mock;
const mockPrismaWorkspaceUpdate = prisma.workspace.update as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;


const formData = { workspaceId: "test-123", title: "test Workspace" };

describe("update Workspace Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if the Workspace not found", async () => {
    mockPrismaWorkspaceFindFirst.mockResolvedValue(null);
    const result = await updateWorkspace(formData);

    expect(result).toEqual({ error: "Workspace não encontrada" });
    expect(mockPrismaWorkspaceUpdate).not.toHaveBeenCalled();
  });
  it("should return a validation error for an empty id", async () => {
    const result = await updateWorkspace({ workspaceId: "", title: "test Workspace" });

    expect(result.error).toBeDefined();
    expect(result.error).toContain("O id é obrigatório");
  });

  it("should return a validation error for an empty title", async () => {
    const result = await updateWorkspace({ workspaceId: "test-123", title: "" });
    expect(result.error).toBeDefined();
    expect(result.error).toContain("O titulo é obrigatório");
  });

  it("should update a Workspace and revalidate the path on success", async () => {
    const updatedWorkspace = { id: formData.workspaceId, title: formData.title };
    mockPrismaWorkspaceFindFirst.mockResolvedValue({ id: formData.workspaceId });
    mockPrismaWorkspaceUpdate.mockResolvedValue(updatedWorkspace);

    const result = await updateWorkspace(formData);

    expect(mockPrismaWorkspaceFindFirst).toHaveBeenCalledWith({
      where: { id: formData.workspaceId }
    })
    expect(mockPrismaWorkspaceUpdate).toHaveBeenCalledWith({
      where: { id: formData.workspaceId },
      data: { title: formData.title }
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(result).toEqual({ data: "Workspace atualizada com sucesso!" })
  });

  it("should return an error if prisma update fails", async () => {
    mockPrismaWorkspaceFindFirst.mockResolvedValue({ id: formData.workspaceId });
    mockPrismaWorkspaceUpdate.mockRejectedValue(new Error("Database error"));

    const result = await updateWorkspace(formData);

    expect(result).toEqual({ error: "Falha ao atualizar Workspace" });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});