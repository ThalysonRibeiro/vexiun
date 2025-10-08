import { render, screen } from "@testing-library/react";
import { PrioritiesBar } from "../priorities-bar";
import { Priority } from "@/generated/prisma";

describe("PrioritiesBar Component", () => {
  const mockPriorities = [
    { priority: "HIGH" as Priority, count: 2 },
    { priority: "MEDIUM" as Priority, count: 3 },
    { priority: "LOW" as Priority, count: 5 },
  ]; // Total = 10

  it("should render the label by default", () => {
    render(<PrioritiesBar priorities={mockPriorities} />);
    expect(screen.getByText("Prioridade geral")).toBeInTheDocument();
  });

  it("should render the label when explicitly set to true", () => {
    render(<PrioritiesBar priorities={mockPriorities} label={true} />);
    expect(screen.getByText("Prioridade geral")).toBeInTheDocument();
  });

  it("should not render the label when set to false", () => {
    render(<PrioritiesBar priorities={mockPriorities} label={false} />);
    expect(screen.queryByText("Prioridade geral")).not.toBeInTheDocument();
  });

  it("should render the correct number of priority segments", () => {
    render(<PrioritiesBar priorities={mockPriorities} />);
    const barContainer = screen.getByTestId("progress-bar-container");
    expect(barContainer.children.length).toBe(3);
  });

  it("should calculate and apply correct width and color for each segment", () => {
    render(<PrioritiesBar priorities={mockPriorities} />);
    const barContainer = screen.getByTestId("progress-bar-container");
    const highSegment = barContainer.children[0] as HTMLElement;
    const mediumSegment = barContainer.children[1] as HTMLElement;
    const lowSegment = barContainer.children[2] as HTMLElement;

    expect(highSegment.style.width).toBe("20%");
    expect(mediumSegment.style.width).toBe("30%");
    expect(lowSegment.style.width).toBe("50%");

    expect(highSegment.style.backgroundColor).toBe("oklch(0.705 0.213 47.604)"); // HIGH
    expect(mediumSegment.style.backgroundColor).toBe("oklch(0.795 0.184 86.047)"); // MEDIUM
    expect(lowSegment.style.backgroundColor).toBe("oklch(0.723 0.219 149.579)"); // LOW
  });

  it("should handle an empty priorities array gracefully", () => {
    render(<PrioritiesBar priorities={[]} />);
    const barContainer = screen.getByTestId("progress-bar-container");
    expect(barContainer.children.length).toBe(0);
  });

  it("should handle total count of zero to avoid division by zero", () => {
    const zeroCountPriorities = [
        { priority: "HIGH" as Priority, count: 0 },
        { priority: "LOW" as Priority, count: 0 },
    ];
    render(<PrioritiesBar priorities={zeroCountPriorities} />);
    const barContainer = screen.getByTestId("progress-bar-container");
    const highSegment = barContainer.children[0] as HTMLElement;
    const lowSegment = barContainer.children[1] as HTMLElement;

    expect(highSegment.style.width).toBe("0%");
    expect(lowSegment.style.width).toBe("0%");
  });
});