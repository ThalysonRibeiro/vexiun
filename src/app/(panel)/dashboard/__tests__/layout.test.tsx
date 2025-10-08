import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import { Workspace, Group, Item } from "@/generated/prisma";
import { Session } from "next-auth";
import Layout from "../layout";
import { getWorkspaces } from "../_data-access/get-workspace";

jest.mock("../_data-access/get-Workspaces");

jest.mock("../_components/sidebar/app-sidebar", () => ({
  AppSidebar: ({ Workspaces, userData }: { Workspaces: Workspace[], userData: Session | null }) => (
    <div data-testid="app-sidebar">
      <span data-testid="Workspaces-count">{Workspaces?.length || 0}</span>
      <span data-testid="user-email">{userData?.user?.email || "no-email"}</span>
    </div>
  )
}));

jest.mock("@/components/ui/sidebar", () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
  SidebarTrigger: ({ className }: { className?: string }) => (
    <button data-testid="sidebar-trigger" className={className}>
      Toggle
    </button>
  ),
}));

const mockSession = {
  user: { id: "1", email: "user@test.com" }
} as Session;

type MockedWorkspace = Workspace & {
  groupe: (Group & { item: Item[] })[];
};

const mockWorkspaces: MockedWorkspace[] = [
  { id: "1", title: "Workspace 1", createdAt: new Date(), updatedAt: new Date(), userId: "1", groupe: [] },
  { id: "2", title: "Workspace 2", createdAt: new Date(), updatedAt: new Date(), userId: "1", groupe: [] }
];

const mockGetWorkspaces = getWorkspaces as jest.MockedFunction<typeof getWorkspaces>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockGetSession = getSession as unknown as jest.Mock<Promise<Session | null>>;

describe("Dashboard Layout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should redirect to home when no session exists", async () => {
      mockGetSession.mockResolvedValue(null);
      mockRedirect.mockImplementation(() => {
        throw new Error("NEXT_REDIRECT");
      });
      await expect(Layout({ children: <div>Test</div> })).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith("/");
      expect(mockGetWorkspaces).not.toHaveBeenCalled();
    });

    it("should not redirect when session exists", async () => {
      mockGetSession.mockResolvedValue(mockSession);
      mockGetWorkspaces.mockResolvedValue([]);
      const result = await Layout({ children: <div>Test</div> });
      expect(mockRedirect).not.toHaveBeenCalled();
      expect(mockGetWorkspaces).toHaveBeenCalled();
    });
  });

  describe("Data Loading", () => {
    beforeEach(() => {
      mockGetSession.mockResolvedValue(mockSession);
    });

    it("should load Workspaces when authenticated", async () => {
      mockGetWorkspaces.mockResolvedValue(mockWorkspaces);
      const result = await Layout({
        children: <div data-testid="children">Test Content</div>
      });
      expect(mockGetWorkspaces).toHaveBeenCalled();
      render(result);
      expect(screen.getByTestId("Workspaces-count")).toHaveTextContent("2");
    });

    it("should handle empty Workspaces array", async () => {
      mockGetWorkspaces.mockResolvedValue([]);
      const result = await Layout({
        children: <div data-testid="children">Test Content</div>
      });
      render(result);
      expect(screen.getByTestId("Workspaces-count")).toHaveTextContent("0");
    });

    it("should handle getWorkspaces error gracefully", async () => {
      mockGetWorkspaces.mockRejectedValue(new Error("Database error"));
      await expect(
        Layout({ children: <div>Test</div> })
      ).rejects.toThrow("Database error");
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe("Component Rendering", () => {
    const localMockWorkspaces: MockedWorkspace[] = [{ id: "1", title: "Workspace 1", createdAt: new Date(), updatedAt: new Date(), userId: "1", groupe: [] }];
    beforeEach(() => {
      mockGetSession.mockResolvedValue(mockSession);
      mockGetWorkspaces.mockResolvedValue(localMockWorkspaces);
    });

    it("should render all components with correct props", async () => {
      const result = await Layout({
        children: <div data-testid="test-children">Children Content</div>
      });
      render(result);
      expect(screen.getByTestId("sidebar-provider")).toBeInTheDocument();
      expect(screen.getByTestId("app-sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar-trigger")).toBeInTheDocument();
      expect(screen.getByTestId("test-children")).toBeInTheDocument();
    });

    it("should pass correct props to AppSidebar", async () => {
      const result = await Layout({ children: <div>Test</div> });
      render(result);
      expect(screen.getByTestId("Workspaces-count")).toHaveTextContent("1");
      expect(screen.getByTestId("user-email")).toHaveTextContent("user@test.com");
    });

    it("should render SidebarTrigger with fixed class", async () => {
      const result = await Layout({ children: <div>Test</div> });
      render(result);
      const trigger = screen.getByTestId("sidebar-trigger");
      expect(trigger).toHaveClass("fixed");
    });
  });
});


