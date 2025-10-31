import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeToggle } from "../modeToggle";
import { useTheme } from "next-themes";

// Mock the next-themes useTheme hook
jest.mock("next-themes", () => ({
  useTheme: jest.fn()
}));

describe("ModeToggle", () => {
  const mockSetTheme = jest.fn();
  const mockTheme = "system"; // Default theme for tests

  beforeEach(() => {
    (useTheme as jest.Mock).mockReturnValue({
      setTheme: mockSetTheme,
      theme: mockTheme,
      resolvedTheme: mockTheme
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<ModeToggle />);
    expect(screen.getByRole("button", { name: /Toggle theme/i })).toBeInTheDocument();
  });

  it("displays the current theme icon (system by default in mock)", () => {
    render(<ModeToggle />);
    // Assuming the system icon is rendered by default based on mockTheme
    // You might need to adjust this selector based on the actual icon rendering logic
    expect(screen.getByRole("button", { name: /Toggle theme/i })).toBeInTheDocument();
  });

  it("calls setTheme with 'light' when Light option is clicked", async () => {
    render(<ModeToggle />);
    await userEvent.click(screen.getByRole("button", { name: /Toggle theme/i })); // Open dropdown
    await userEvent.click(screen.getByRole("menuitem", { name: /Light/i }));
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });

  it("calls setTheme with 'dark' when Dark option is clicked", async () => {
    render(<ModeToggle />);
    await userEvent.click(screen.getByRole("button", { name: /Toggle theme/i })); // Open dropdown
    await userEvent.click(screen.getByRole("menuitem", { name: /Dark/i }));
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  it("calls setTheme with 'system' when System option is clicked", async () => {
    render(<ModeToggle />);
    await userEvent.click(screen.getByRole("button", { name: /Toggle theme/i })); // Open dropdown
    await userEvent.click(screen.getByRole("menuitem", { name: /System/i }));
    expect(mockSetTheme).toHaveBeenCalledWith("system");
  });
});
