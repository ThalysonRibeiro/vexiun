import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Summary, ProgressGoals } from "../summary";
import { goalUndo } from "../../_actions/goal-undo";
import { toast } from "sonner";
import { PendingGoal, WeekSummaryResponse } from "../../_types";

// Mock dependencies
jest.mock("../../_actions/goal-undo");
jest.mock("sonner", () => ({
  toast: Object.assign(jest.fn(), {
    error: jest.fn(),
  }),
}));
jest.mock("../peding-goals", () => ({
  PedingGoals: jest.fn(() => <div data-testid="peding-goals-mock" />),
}));
jest.mock("@/components/ui/dialog", () => ({
  DialogTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const mockGoalUndo = goalUndo as jest.Mock;
const mockToast = toast as jest.MockedFunction<typeof toast>;
const mockToastError = (toast).error as jest.Mock;

const mockPendingGoals: PendingGoal[] = [
  { id: "1", title: "Pending Goal", desiredWeeklyFrequency: 5, completionCount: 2 },
];

const mockSummaryData: WeekSummaryResponse = {
  summary: {
    completed: 5,
    total: 10,
    goalsPerDay: [
      {
        date: "2024-07-24",
        dayOfWeek: "Quarta-feira",
        goals: [
          { id: "c1", title: "Completed Goal 1", completedAt: new Date("2024-07-24T10:00:00Z") },
        ],
      },
    ],
  },
};

describe("Summary Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers().setSystemTime(new Date("2024-07-24T12:00:00.000Z"));
    mockToast.mockClear();
    mockToastError.mockClear();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should return null if summaryData.summary is not provided", () => {
    const { container } = render(
      <Summary data={[]} summaryData={{ summary: undefined, error: "No data" }} timeZone="UTC" language="en-US" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render the main content correctly", () => {
    render(
      <Summary data={mockPendingGoals} summaryData={mockSummaryData} timeZone="UTC" language="pt-BR" />
    );

    // Expecting "21 jul - 27 jul" based on the current mock date and pt-BR locale behavior
    expect(screen.getByText(/21 jul - 27 jul/)).toBeInTheDocument();

    expect(screen.getByTestId("peding-goals-mock")).toBeInTheDocument();
    expect(screen.getByText("Sua semana")).toBeInTheDocument();

    // Look for the specific span that contains the goal title
    expect(screen.getByText((content, element) => {
      if (!element) return false;
      const hasClass = element.classList.contains("font-semibold");
      const hasText = element.textContent?.includes("ompleted Goal 1");
      return hasClass && Boolean(hasText);
    })).toBeInTheDocument();
  });

  it("should call goalUndo and show toast on undo button click", async () => {
    mockGoalUndo.mockResolvedValue({ data: "Undone!" });
    render(
      <Summary data={mockPendingGoals} summaryData={mockSummaryData} timeZone="UTC" language="pt-BR" />
    );

    const undoButton = screen.getByRole("button", { name: /desfazer/i });
    fireEvent.click(undoButton);

    await waitFor(() => {
      expect(mockGoalUndo).toHaveBeenCalledWith({ id: "c1" });
      expect(mockToast).toHaveBeenCalledWith("🙄👀 Undone!");
    });
  });

  it("should show error toast if goalUndo returns an error", async () => {
    mockGoalUndo.mockResolvedValue({ error: "Undo failed" });
    render(
      <Summary data={mockPendingGoals} summaryData={mockSummaryData} timeZone="UTC" language="pt-BR" />
    );

    const undoButton = screen.getByRole("button", { name: /desfazer/i });
    fireEvent.click(undoButton);

    await waitFor(() => {
      expect(mockGoalUndo).toHaveBeenCalledWith({ id: "c1" });
      expect(mockToastError).toHaveBeenCalledWith("Undo failed");
    });
  });

  it("should show error toast if goalId is empty", async () => {
    const summaryDataWithEmptyGoalId = {
      summary: {
        completed: 5,
        total: 10,
        goalsPerDay: [
          {
            date: "2024-07-24",
            dayOfWeek: "Quarta-feira",
            goals: [
              { id: "", title: "Goal without ID", completedAt: new Date("2024-07-24T10:00:00Z") },
            ],
          },
        ],
      },
    };

    render(
      <Summary data={mockPendingGoals} summaryData={summaryDataWithEmptyGoalId} timeZone="UTC" language="pt-BR" />
    );

    const undoButton = screen.getByRole("button", { name: /desfazer/i });
    fireEvent.click(undoButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Erro ao desfazer meta.");
    });
  });

  it("should show error toast if goalUndo throws an exception", async () => {
    mockGoalUndo.mockRejectedValue(new Error("Network error"));
    render(
      <Summary data={mockPendingGoals} summaryData={mockSummaryData} timeZone="UTC" language="pt-BR" />
    );

    const undoButton = screen.getByRole("button", { name: /desfazer/i });
    fireEvent.click(undoButton);

    await waitFor(() => {
      expect(mockGoalUndo).toHaveBeenCalledWith({ id: "c1" });
      expect(mockToastError).toHaveBeenCalledWith("Erro ao desfazer meta.");
    });
  });
});

describe("ProgressGoals Component", () => {
  it("should render the progress bar and text correctly", () => {
    render(<ProgressGoals total={20} completed={5} />);
    expect(screen.getByText("25%")).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.startsWith("Você completou"))).toBeInTheDocument();
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "5");
    expect(progressBar).toHaveAttribute("aria-valuemax", "20");
  });

  it("should handle total being zero to avoid NaN", () => {
    render(<ProgressGoals total={0} completed={0} />);
    expect(screen.getByText("0%")).toBeInTheDocument();

    // Look specifically for the span that contains the full text and has no nested spans
    expect(screen.getByText((content, element) => {
      if (!element) return false;
      const hasProgressText = element.textContent?.includes("Você completou") &&
        element.textContent?.includes("metas nessa semana");
      const isSpanElement = element.tagName === "SPAN";
      const hasNestedSpans = element.querySelectorAll("span").length > 0;

      return Boolean(hasProgressText) && isSpanElement && hasNestedSpans;
    })).toBeInTheDocument();
  });
});
