import { render, screen } from "@testing-library/react";
import GoalsPage from "./page";
import { getWeekPendingGoal } from "./_data-access/get-week-pendingGoal";
import { GetWeekSummary } from "./_data-access/get-week-summary";
import { getDetailUser } from "../_data-access/get-detail-user";
import { GoalsContent } from "./_components/goals-content";
import { PendingGoal, WeekSummaryResponse } from "./_types";
import { UserWithCounts } from "../profile/types/profile-types";

// Mock the data fetching functions
jest.mock("./_data-access/get-week-pendingGoal");
jest.mock("./_data-access/get-week-summary");
jest.mock("../_data-access/get-detail-user");

// Mock the client component to check the props it receives
jest.mock("./_components/goals-content", () => ({
  GoalsContent: jest.fn(({ data, summaryData, timeZone, language }) => (
    <div data-testid="goals-content">
      <span data-testid="pending-goals-count">{data.length}</span>
      <span data-testid="summary-total">{summaryData.summary.total}</span>
      <span data-testid="timezone">{timeZone}</span>
      <span data-testid="language">{language}</span>
    </div>
  )),
}));

const mockGetWeekPendingGoal = getWeekPendingGoal as jest.MockedFunction<typeof getWeekPendingGoal>;
const mockGetWeekSummary = GetWeekSummary as jest.MockedFunction<typeof GetWeekSummary>;
const mockGetDetailUser = getDetailUser as jest.MockedFunction<typeof getDetailUser>;

const mockPendingGoals: PendingGoal[] = [
  { id: "goal-1", title: "Read a book", desiredWeeklyFrequency: 3, completionCount: 1 },
  { id: "goal-2", title: "Exercise", desiredWeeklyFrequency: 5, completionCount: 4 },
];

const mockWeekSummary: WeekSummaryResponse = {
  summary: {
    completed: 5,
    total: 8,
    goalsPerDay: [],
  },
};

const mockDetailUserWithSettings = {
  id: "user-1",
  name: "Test User",
  email: "test@test.com",
  userSettings: {
    id: "settings-1",
    userId: "user-1",
    timezone: "Europe/London",
    language: "en-US",
    pushNotifications: true,
    emailNotifications: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  _count: { sessions: 1 },
  goals: [],
} as unknown as UserWithCounts;

const mockDetailUserWithoutSettings = {
  id: "user-1",
  name: "Test User",
  email: "test@test.com",
  UserSettings: null,
  _count: { sessions: 1 },
  goals: [],
} as unknown as UserWithCounts;


describe("GoalsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render GoalsContent with correct props when all data is fetched successfully", async () => {
    mockGetWeekPendingGoal.mockResolvedValue(mockPendingGoals);
    mockGetWeekSummary.mockResolvedValue(mockWeekSummary);
    mockGetDetailUser.mockResolvedValue(mockDetailUserWithSettings);

    const Page = await GoalsPage();
    render(Page as React.ReactElement);

    expect(screen.getByTestId("goals-content")).toBeInTheDocument();
    expect(screen.getByTestId("pending-goals-count")).toHaveTextContent("2");
    expect(screen.getByTestId("summary-total")).toHaveTextContent("8");
    expect(screen.getByTestId("timezone")).toHaveTextContent("Europe/London");
    expect(screen.getByTestId("language")).toHaveTextContent("en-US");
  });

  it("should return null if getDetailUser returns null", async () => {
    mockGetWeekPendingGoal.mockResolvedValue(mockPendingGoals);
    mockGetWeekSummary.mockResolvedValue(mockWeekSummary);
    mockGetDetailUser.mockResolvedValue(null);

    const Page = await GoalsPage();

    expect(Page).toBeNull();
  });

  it("should use default timezone and language when UserSettings are null", async () => {
    mockGetWeekPendingGoal.mockResolvedValue(mockPendingGoals);
    mockGetWeekSummary.mockResolvedValue(mockWeekSummary);
    mockGetDetailUser.mockResolvedValue(mockDetailUserWithoutSettings);

    const Page = await GoalsPage();
    render(Page as React.ReactElement);

    expect(screen.getByTestId("goals-content")).toBeInTheDocument();
    expect(screen.getByTestId("timezone")).toHaveTextContent("America/Sao_Paulo");
    expect(screen.getByTestId("language")).toHaveTextContent("pt-BR");
  });

  it("should handle empty pending goals", async () => {
    mockGetWeekPendingGoal.mockResolvedValue([]);
    mockGetWeekSummary.mockResolvedValue(mockWeekSummary);
    mockGetDetailUser.mockResolvedValue(mockDetailUserWithSettings);

    const Page = await GoalsPage();
    render(Page as React.ReactElement);

    expect(screen.getByTestId("goals-content")).toBeInTheDocument();
    expect(screen.getByTestId("pending-goals-count")).toHaveTextContent("0");
  });

  it("should handle empty week summary", async () => {
    const emptySummary: WeekSummaryResponse = {
      summary: { completed: 0, total: 0, goalsPerDay: [] }
    };
    mockGetWeekPendingGoal.mockResolvedValue(mockPendingGoals);
    mockGetWeekSummary.mockResolvedValue(emptySummary);
    mockGetDetailUser.mockResolvedValue(mockDetailUserWithSettings);

    const Page = await GoalsPage();
    render(Page as React.ReactElement);

    expect(screen.getByTestId("goals-content")).toBeInTheDocument();
    expect(screen.getByTestId("summary-total")).toHaveTextContent("0");
  });
});
