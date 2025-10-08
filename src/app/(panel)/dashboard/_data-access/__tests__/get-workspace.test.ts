import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Session } from "next-auth";
import { Prisma } from "@/generated/prisma";
import { getWorkspaces } from "../get-workspace";

jest.mock("@/lib/auth");
jest.mock("@/lib/prisma", () => ({
  Workspace: { findMany: jest.fn() },
  group: { findMany: jest.fn() },
}));



const mockAuth = auth as jest.Mock;
const mockPrismaWorkspaceFindMany = prisma.workspace.findMany as jest.Mock;
const mockPrismaGroupFindMany = prisma.group.findMany as jest.Mock;


const mockSession: Session = {
  user: { id: "user-123" },
  expires: "some-future-date",
};


describe("getWorkspaces", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return an empty array if session is not found", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await getWorkspaces();
    expect(result).toEqual([]);
    expect(mockPrismaWorkspaceFindMany).not.toHaveBeenCalled();
  });

  it("should return an empty array if prisma query fails", async () => {
    mockAuth.mockResolvedValue(mockSession);
    mockPrismaWorkspaceFindMany.mockRejectedValue(new Error("Database error"));
    const result = await getWorkspaces();
    expect(result).toEqual([]);
  });

  it("should return Workspace summaries with groupsCount and itemsCount", async () => {
    mockAuth.mockResolvedValue(mockSession);

    // mock da primeira query: Workspaces
    mockPrismaWorkspaceFindMany.mockResolvedValue([
      { id: "d1", title: "Workspace 1", _count: { groups: 2 } },
      { id: "d2", title: "Workspace 2", _count: { groups: 1 } },
    ]);

    mockPrismaGroupFindMany.mockResolvedValue([
      { workspaceId: "d1", _count: { item: 3 } },
      { workspaceId: "d1", _count: { item: 2 } },
      { workspaceId: "d2", _count: { item: 4 } },
    ]);

    const result = await getWorkspaces();

    expect(mockPrismaWorkspaceFindMany).toHaveBeenCalled();
    expect(mockPrismaGroupFindMany).toHaveBeenCalledWith({
      where: { workspaceId: { in: ["d1", "d2"] } },
      select: { workspaceId: true, _count: { select: { item: true } } },
    });

    expect(result).toEqual([
      { id: "d1", title: "Workspace 1", groupsCount: 2, itemsCount: 5 },
      { id: "d2", title: "Workspace 2", groupsCount: 1, itemsCount: 4 },
    ]);
  });

});