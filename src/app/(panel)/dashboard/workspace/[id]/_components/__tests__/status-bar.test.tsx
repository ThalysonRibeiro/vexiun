import { render, screen } from "@testing-library/react";
import { StatusBar } from "../status-bar";
import { Status } from "@/generated/prisma";

describe("StatusBar Component", () => {
  const mockStatus = [
    { status: "DONE" as Status, count: 6 },
    { status: "IN_PROGRESS" as Status, count: 4 },
  ]; // Total = 10

  it("should render the main heading", () => {
    render(<StatusBar status={mockStatus} />);
    expect(screen.getByText("Status geral")).toBeInTheDocument();
  });

  it("should render the correct number of status segments", () => {
    render(<StatusBar status={mockStatus} />);
    const barContainer = screen.getByTestId("progress-bar-container");
    expect(barContainer.children.length).toBe(2);
  });

  it("should calculate and apply correct width and color for each segment", () => {
    render(<StatusBar status={mockStatus} />);
    const barContainer = screen.getByTestId("progress-bar-container");
    const doneSegment = barContainer.children[0] as HTMLElement;
    const inProgressSegment = barContainer.children[1] as HTMLElement;

    expect(doneSegment.style.width).toBe("60%");
    expect(inProgressSegment.style.width).toBe("40%");

    expect(doneSegment.style.backgroundColor).toBe("oklch(0.723 0.219 149.579)"); // DONE
    expect(inProgressSegment.style.backgroundColor).toBe("oklch(0.623 0.214 259.815)"); // IN_PROGRESS
  });

  it("should handle an empty status array gracefully", () => {
    render(<StatusBar status={[]} />);
    const barContainer = screen.getByTestId("progress-bar-container");
    expect(barContainer.children.length).toBe(0);
  });

  it("should handle total count of zero to avoid division by zero", () => {
    const zeroCountStatus = [
        { status: "DONE" as Status, count: 0 },
        { status: "STOPPED" as Status, count: 0 },
    ];
    render(<StatusBar status={zeroCountStatus} />);
    const barContainer = screen.getByTestId("progress-bar-container");
    const doneSegment = barContainer.children[0] as HTMLElement;
    const stoppedSegment = barContainer.children[1] as HTMLElement;

    expect(doneSegment.style.width).toBe("0%");
    expect(stoppedSegment.style.width).toBe("0%");
  });
});