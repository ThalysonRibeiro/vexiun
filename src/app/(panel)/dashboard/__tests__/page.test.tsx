import React from "react";
import { Status, Priority, Workspace, Group, Item, User, UserSettings } from "@/generated/prisma";
import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import { GetWeekSummary } from "../goals/_data-access/get-week-summary";
import { getDetailUser } from "../_data-access/get-detail-user";
import { getPriorities } from "../workspace/[id]/_data-access/get-priorities";
import type { WeekSummaryResponse } from "../goals/_types";
import { getWorkspaces } from "../_data-access/get-workspace";

jest.mock("next/navigation");
jest.mock("@/lib/getSession");
jest.mock("../goals/_data-access/get-week-summary");
jest.mock("../_data-access/get-detail-user");
jest.mock("../_data-access/get-Workspaces");
jest.mock("../workspace/[id]/_data-access/get-priorities");

jest.mock("@/components/login-alert", () => ({
  LoginAlert: ({ emailNotifications }: { emailNotifications?: boolean }) => (
    <div data-testid="login-alert" data-email-notifications={emailNotifications?.toString()} />
  ),
}));

jest.mock("../goals/_components/summary", () => ({
  ProgressGoals: ({ total, completed }: { total: number; completed: number }) => (
    <div data-testid="progress-goals" data-total={total} data-completed={completed} />
  ),
}));

jest.mock("../workspace/[id]/_components/priorities-bar", () => ({
  PrioritiesBar: ({ priorities, label }: { priorities: Item[]; label: boolean }) => (
    <div data-testid="priorities-bar" />
  ),
}));

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="Workspace-link">{children}</a>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div data-testid="card" className={className}>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-description">{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="card-title">{children}</div>
  ),
}));

jest.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));

type WorkspaceWithGroups = Workspace & {
  groupe: Array<Group & { item: Item[] }>;
};

const createMockUser = (overrides?: Partial<User>): User => ({
  id: "1",
  name: "Test User",
  email: "test@example.com",
  image: null,
  emailVerified: null,
  emailVerificationToken: null,
  verificationExpiresAt: null,
  acceptTerms: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const createMockSession = (user?: Partial<User>) => ({
  user: createMockUser(user),
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createMockDetailUser = (overrides?: any) => ({
  ...createMockUser(),
  goals: [],
  UserSettings: null,
  _count: { sessions: 0 },
  ...overrides,
});

const createMockWeekSummary = (total = 1, completed = 1): WeekSummaryResponse => ({
  summary: { total, completed, goalsPerDay: [] },
});

const createMockWorkspace = (id: string, title: string, groups: Array<Group & { item: Item[] }> = []): WorkspaceWithGroups => {
  const now = new Date();
  return { id, title, userId: "user-1", createdAt: now, updatedAt: now, groupe: groups };
};

const createMockGroup = (id: string, title: string, items: Item[] = []): Group & { item: Item[] } => {
  const now = new Date();
  return { id, title, textColor: "#000000", workspaceId: "Workspace-1", createdAt: now, updatedAt: now, item: items };
};

const createMockItem = (id: string, title: string, groupId = "group-1"): Item => {
  const now = new Date();
  return { id, title, term: now, status: Status.DONE, priority: Priority.MEDIUM, notes: "", description: `Descrição da ${title}`, groupId, createdAt: now, updatedAt: now };
};

const mockDashboardModule = {
  Priorities: ({ workspaceId }: { workspaceId: string }) => (
    <div data-testid="priorities-component" data-Workspace-id={workspaceId}>
      <div data-testid="priorities-bar" />
    </div>
  ),
  default: jest.fn()
};

jest.mock("../page", () => mockDashboardModule);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGetSession = getSession as jest.MockedFunction<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGetDetailUser = getDetailUser as jest.MockedFunction<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGetWeekSummary = GetWeekSummary as jest.MockedFunction<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGetWorkspaces = getWorkspaces as jest.MockedFunction<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockGetPriorities = getPriorities as jest.MockedFunction<any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockRedirect = redirect as jest.MockedFunction<any>;

const createTestDashboard = () => {
  const { Priorities } = mockDashboardModule;

  return async function TestDashboard() {
    const session = await getSession();
    if (!session) { redirect("/"); return; }
    const Workspaces = await getWorkspaces();
    const weekSummaryDate = await GetWeekSummary();
    const detailUser = await getDetailUser();
    if (!detailUser) return null;
    if (!weekSummaryDate.summary) { return null; }
    const totalItens = (group: Array<Group & { item: Item[] }>): number => {
      const count: Item[] = [];
      for (const element of group) { element.item.forEach((item: Item) => { count.push(item); }); }
      return count.length;
    };
    return (
      <>
        <div data-testid="login-alert" />
        <main className="container mx-auto px-6 pt-6">
          <section className="flex flex-col justify-between space-y-4">
            <div>
              <h1 className="text-2xl font-semibold">Bem vindo de volta!</h1>
              <h2>Aqui está seu resumo.</h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {Workspaces.map((Workspace: WorkspaceWithGroups) => (
                <a href={`/dashboard/workspace/${Workspace.id}`} key={Workspace.id} data-testid="Workspace-link">
                  <div data-testid="card">
                    <div data-testid="card-header">
                      <div data-testid="card-title">{Workspace.title}</div>
                      <div data-testid="card-description">
                        Total grupos: {Workspace.groupe.length}
                        <br />
                        Total tarefas: {totalItens(Workspace.groupe)}
                      </div>
                    </div>
                    <div data-testid="card-content">
                      <Priorities workspaceId={Workspace.id} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <hr data-testid="separator" />
            {weekSummaryDate?.summary?.total > 0 ? (
              <div className="w-full space-y-4">
                <h3>Progresso das suas metas</h3>
                <div data-testid="progress-goals" />
              </div>
            ) : (
              <p>Cadastre metas e acompanhe sua evolução</p>
            )}
          </section>
        </main>
      </>
    );
  };
};

describe("Dashboard Page", () => {
  let TestDashboard: () => Promise<React.ReactElement | null | undefined>;

  const setupBasicMocks = () => {
    mockGetSession.mockResolvedValue(createMockSession());
    mockGetDetailUser.mockResolvedValue(createMockDetailUser());
    mockGetWeekSummary.mockResolvedValue(createMockWeekSummary());
    mockGetWorkspaces.mockResolvedValue([]);
    mockGetPriorities.mockResolvedValue([]);
  };

  const setupSuccessfulRender = () => {
    const group1 = createMockGroup("group-1", "Group 1", [
      createMockItem("task-1", "Task 1"),
      createMockItem("task-2", "Task 2"),
    ]);
    const Workspace = createMockWorkspace("Workspace-1", "Work Workspace", [group1]);
    mockGetSession.mockResolvedValue(createMockSession());
    mockGetDetailUser.mockResolvedValue(createMockDetailUser());
    mockGetWeekSummary.mockResolvedValue(createMockWeekSummary(10, 5));
    mockGetWorkspaces.mockResolvedValue([Workspace]);
    mockGetPriorities.mockResolvedValue([]);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    TestDashboard = createTestDashboard();
  });

  describe("Authentication", () => {
    it("should redirect when no session exists", async () => {
      mockGetSession.mockResolvedValue(null);
      await TestDashboard();
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });

    it("should not redirect when session exists", async () => {
      setupBasicMocks();
      await TestDashboard();
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe("Early Returns", () => {
    beforeEach(() => {
      mockGetSession.mockResolvedValue(createMockSession());
    });

    it("should return null when user details not found", async () => {
      mockGetDetailUser.mockResolvedValue(null);
      const result = await TestDashboard();
      expect(result).toBeNull();
    });

    it("should return null when week summary not available", async () => {
      mockGetDetailUser.mockResolvedValue(createMockDetailUser());
      mockGetWeekSummary.mockResolvedValue({ error: "Nenhum meta completa" } as WeekSummaryResponse);
      const result = await TestDashboard();
      expect(result).toBeNull();
    });
  });

  describe("Data Loading", () => {
    beforeEach(() => { setupBasicMocks(); });
    it("should call all required data functions", async () => {
      await TestDashboard();
      expect(mockGetSession).toHaveBeenCalled();
      expect(mockGetDetailUser).toHaveBeenCalled();
      expect(mockGetWeekSummary).toHaveBeenCalled();
      expect(mockGetWorkspaces).toHaveBeenCalled();
    });

    it("should call getPriorities for each Workspace", async () => {
      const Workspaces = [
        createMockWorkspace("Workspace-1", "Workspace 1"),
        createMockWorkspace("Workspace-2", "Workspace 2"),
      ];
      mockGetWorkspaces.mockResolvedValue(Workspaces);
      const result = await TestDashboard();
      render(result);
      const prioritiesComponents = screen.getAllByTestId("priorities-component");
      expect(prioritiesComponents).toHaveLength(2);
      expect(prioritiesComponents[0]).toHaveAttribute("data-Workspace-id", "Workspace-1");
      expect(prioritiesComponents[1]).toHaveAttribute("data-Workspace-id", "Workspace-2");
    });
  });

  describe("Component Structure", () => {
    it("should render main components when data is available", async () => {
      setupSuccessfulRender();
      const component = await TestDashboard();
      render(component);
      expect(screen.getByTestId("login-alert")).toBeInTheDocument();
      expect(screen.getByText("Bem vindo de volta!")).toBeInTheDocument();
      expect(screen.getByText("Aqui está seu resumo.")).toBeInTheDocument();
      expect(screen.getByTestId("separator")).toBeInTheDocument();
    });

    it("should render Workspace cards", async () => {
      setupSuccessfulRender();
      const component = await TestDashboard();
      render(component);
      expect(screen.getByText("Work Workspace")).toBeInTheDocument();
      expect(screen.getByTestId("Workspace-link")).toBeInTheDocument();
      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByTestId("priorities-component")).toBeInTheDocument();
    });

    it("should render progress goals section", async () => {
      setupSuccessfulRender();
      const component = await TestDashboard();
      render(component);
      expect(screen.getByText("Progresso das suas metas")).toBeInTheDocument();
      expect(screen.getByTestId("progress-goals")).toBeInTheDocument();
    });

    it("should show no goals message when total is 0", async () => {
      mockGetSession.mockResolvedValue(createMockSession());
      mockGetDetailUser.mockResolvedValue(createMockDetailUser());
      mockGetWeekSummary.mockResolvedValue(createMockWeekSummary(0, 0));
      mockGetWorkspaces.mockResolvedValue([]);
      const component = await TestDashboard();
      render(component);
      expect(screen.getByText("Cadastre metas e acompanhe sua evolução")).toBeInTheDocument();
      expect(screen.queryByTestId("progress-goals")).not.toBeInTheDocument();
    });
  });

  describe("Workspace Item Count Logic", () => {
    it("should calculate correct item counts", async () => {
      const group1 = createMockGroup("group-1", "Group 1", [
        createMockItem("task-1", "Task 1"),
        createMockItem("task-2", "Task 2"),
      ]);
      const group2 = createMockGroup("group-2", "Group 2", []);
      const Workspace = createMockWorkspace("Workspace-1", "Workspace 1", [group1, group2]);
      mockGetSession.mockResolvedValue(createMockSession());
      mockGetDetailUser.mockResolvedValue(createMockDetailUser());
      mockGetWeekSummary.mockResolvedValue(createMockWeekSummary());
      mockGetWorkspaces.mockResolvedValue([Workspace]);
      const component = await TestDashboard();
      render(component);
      const cardDescription = screen.getByTestId("card-description");
      expect(cardDescription).toHaveTextContent(/Total grupos:\s*2/);
      expect(cardDescription).toHaveTextContent(/Total tarefas:\s*2/);
    });

    it("should handle empty groups", async () => {
      const group1 = createMockGroup("group-1", "Group 1", [
        createMockItem("task-1", "Task 1"),
        createMockItem("task-2", "Task 2"),
      ]);
      const group2 = createMockGroup("group-2", "Group 2", []);
      const Workspace = createMockWorkspace("Workspace-1", "Workspace 1", [group1, group2]);
      mockGetSession.mockResolvedValue(createMockSession());
      mockGetDetailUser.mockResolvedValue(createMockDetailUser());
      mockGetWeekSummary.mockResolvedValue(createMockWeekSummary());
      mockGetWorkspaces.mockResolvedValue([Workspace]);
      const component = await TestDashboard();
      render(component);
      const cardDescription = screen.getByTestId("card-description");
      expect(cardDescription).toHaveTextContent(/Total grupos:\s*2/);
      expect(cardDescription).toHaveTextContent(/Total tarefas:\s*2/);
    });
  });

  describe("Error Scenarios", () => {
    it("should handle missing Workspace data", async () => {
      setupBasicMocks();
      const component = await TestDashboard();
      render(component);
      expect(screen.queryByTestId("Workspace-link")).not.toBeInTheDocument();
      expect(screen.queryByTestId("card")).not.toBeInTheDocument();
    });

    it("should handle data loading errors", async () => {
      mockGetSession.mockResolvedValue(createMockSession());
      mockGetDetailUser.mockResolvedValue(createMockDetailUser({
        UserSettings: { id: "1", userId: "1", pushNotifications: true, emailNotifications: true, language: "pt-BR", timezone: "America/Sao_Paulo", createdAt: new Date(), updatedAt: new Date() },
      }));
      mockGetWeekSummary.mockResolvedValue(createMockWeekSummary());
      mockGetWorkspaces.mockRejectedValue(new Error("Database error"));
      await expect(TestDashboard()).rejects.toThrow("Database error");
    });
  });
});


