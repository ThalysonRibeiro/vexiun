import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "../header";
import { PrioritiesBar } from "../../[id]/_components/priorities-bar";
import { StatusBar } from "../../[id]/_components/status-bar";
import { Button } from "@/components/ui/button";

// Mock child components
jest.mock("../../[id]/_components/priorities-bar", () => ({
  PrioritiesBar: jest.fn(({ priorities }) => (
    <div data-testid="priorities-bar" data-priorities={JSON.stringify(priorities)} />
  )),
}));

jest.mock("../../[id]/_components/status-bar", () => ({
  StatusBar: jest.fn(({ status }) => (
    <div data-testid="status-bar" data-status={JSON.stringify(status)} />
  )),
}));

// Mock the Button component to inspect its props
jest.mock("@/components/ui/button", () => ({
  Button: jest.fn(({ onClick, variant, children }) => (
    <button onClick={onClick} data-variant={variant}>
      {children}
    </button>
  )),
}));

// Mock data
const mockPrioritiesData = [{ priority: "HIGH", count: 5 }];
const mockStatusData = [{ status: "IN_PROGRESS", count: 10 }];
const mockTabs = [
  { key: "main", label: "Main Board", component: <div>Main</div> },
  { key: "kanban", label: "Kanban Board", component: <div>Kanban</div> },
];
const mockOnTabChange = jest.fn();

describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render PrioritiesBar and StatusBar with correct data", () => {
    render(
      <Header
        tabs={mockTabs}
        activeTab="main"
        onTabChange={mockOnTabChange}
        prioritiesData={mockPrioritiesData}
        statusData={mockStatusData}
      />
    );

    expect(screen.getByTestId("priorities-bar")).toBeInTheDocument();
    expect(screen.getByTestId("status-bar")).toBeInTheDocument();

    expect(PrioritiesBar).toHaveBeenCalledWith({ priorities: mockPrioritiesData }, undefined);
    expect(StatusBar).toHaveBeenCalledWith({ status: mockStatusData }, undefined);
  });

  it("should render tab buttons with correct labels", () => {
    render(
      <Header
        tabs={mockTabs}
        activeTab="main"
        onTabChange={mockOnTabChange}
        prioritiesData={mockPrioritiesData}
        statusData={mockStatusData}
      />
    );

    expect(screen.getByRole("button", { name: "Main Board" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Kanban Board" })).toBeInTheDocument();
  });

  it("should apply 'default' variant to the active tab and 'outline' to inactive tabs", () => {
    render(
      <Header
        tabs={mockTabs}
        activeTab="main"
        onTabChange={mockOnTabChange}
        prioritiesData={mockPrioritiesData}
        statusData={mockStatusData}
      />
    );

    const mainButton = screen.getByRole("button", { name: "Main Board" });
    const kanbanButton = screen.getByRole("button", { name: "Kanban Board" });

    expect(mainButton).toHaveAttribute("data-variant", "default");
    expect(kanbanButton).toHaveAttribute("data-variant", "outline");
  });

  it("should call onTabChange with the correct key when a tab is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Header
        tabs={mockTabs}
        activeTab="main"
        onTabChange={mockOnTabChange}
        prioritiesData={mockPrioritiesData}
        statusData={mockStatusData}
      />
    );

    const kanbanButton = screen.getByRole("button", { name: "Kanban Board" });
    await user.click(kanbanButton);

    expect(mockOnTabChange).toHaveBeenCalledTimes(1);
    expect(mockOnTabChange).toHaveBeenCalledWith("kanban");
  });

  it("should update active tab variant when props change", () => {
    const { rerender } = render(
      <Header
        tabs={mockTabs}
        activeTab="main"
        onTabChange={mockOnTabChange}
        prioritiesData={mockPrioritiesData}
        statusData={mockStatusData}
      />
    );

    // Initial state
    expect(screen.getByRole("button", { name: "Main Board" })).toHaveAttribute("data-variant", "default");
    expect(screen.getByRole("button", { name: "Kanban Board" })).toHaveAttribute("data-variant", "outline");

    // Rerender with a new active tab
    rerender(
      <Header
        tabs={mockTabs}
        activeTab="kanban"
        onTabChange={mockOnTabChange}
        prioritiesData={mockPrioritiesData}
        statusData={mockStatusData}
      />
    );

    // Check updated variants
    expect(screen.getByRole("button", { name: "Main Board" })).toHaveAttribute("data-variant", "outline");
    expect(screen.getByRole("button", { name: "Kanban Board" })).toHaveAttribute("data-variant", "default");
  });
});
