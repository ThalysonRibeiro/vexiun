import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { deleteWorkspace } from "../delete-workspace";

jest.mock('@/lib/prisma', () => ({
  Workspace: {
    findFirst: jest.fn(),
    delete: jest.fn(),
  },
}));
jest.mock('next/cache');

const mockPrismaWorkspaceFindFirst = prisma.workspace.findFirst as jest.Mock;
const mockPrismaWorkspaceDelete = prisma.workspace.delete as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

const existingWorkspace = { id: "123" };


describe("delete Workspace Action", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if the Workspace not found", async () => {
    mockPrismaWorkspaceFindFirst.mockResolvedValue(null);
    const result = await deleteWorkspace('non-existent-id');
    expect(result).toEqual({ error: "Workspace não encontrada" });
    expect(mockPrismaWorkspaceDelete).not.toHaveBeenCalled();
  });
  it("should delete a Workspace and revalidate the path on success", async () => {
    mockPrismaWorkspaceFindFirst.mockResolvedValue(existingWorkspace);
    mockPrismaWorkspaceDelete.mockResolvedValue({});
    const result = await deleteWorkspace(existingWorkspace.id);

    expect(mockPrismaWorkspaceFindFirst).toHaveBeenCalledWith({
      where: { id: existingWorkspace.id },
    })
    expect(mockPrismaWorkspaceDelete).toHaveBeenCalledWith({
      where: { id: existingWorkspace.id },
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    expect(result).toEqual({ data: "Workspace deletada com sucesso!" });
  });

  it("should return an error if prisma delete fails", async () => {
    mockPrismaWorkspaceFindFirst.mockResolvedValue(existingWorkspace);
    mockPrismaWorkspaceDelete.mockRejectedValue(new Error('Database error'));

    const result = await deleteWorkspace(existingWorkspace.id);

    expect(result).toEqual({ error: "Falha ao deletar Workspace" });
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });
});