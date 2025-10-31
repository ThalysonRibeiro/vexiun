import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardSignIn } from "../card-signIn";
import { handleRegister } from "@/app/(public)/_action/signIn";

// Mock the module that contains handleRegister
jest.mock("@/app/(public)/_action/signIn", () => ({
  handleRegister: jest.fn()
}));

describe("CardSignIn component", () => {
  // Clear mock calls before each test
  beforeEach(() => {
    (handleRegister as jest.Mock).mockClear();
  });

  it("should render the component with title and buttons", () => {
    render(<CardSignIn />);

    // Check for the title
    expect(screen.getByText("SignIn")).toBeInTheDocument();

    // Check for the buttons
    expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
  });

  it("should call handleRegister with 'github' when GitHub button is clicked", async () => {
    render(<CardSignIn />);

    const githubButton = screen.getByRole("button", { name: /github/i });
    await userEvent.click(githubButton);

    // Check if handleRegister was called with the correct provider
    expect(handleRegister).toHaveBeenCalledWith("github");
    expect(handleRegister).toHaveBeenCalledTimes(1);
  });

  it("should call handleRegister with 'google' when Google button is clicked", async () => {
    render(<CardSignIn />);

    const googleButton = screen.getByRole("button", { name: /google/i });
    await userEvent.click(googleButton);

    // Check if handleRegister was called with the correct provider
    expect(handleRegister).toHaveBeenCalledWith("google");
    expect(handleRegister).toHaveBeenCalledTimes(1);
  });

  it("should render the visible title and provider buttons", () => {
    render(<CardSignIn />);
    expect(screen.getByText("SignIn")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /google/i })).toBeInTheDocument();
  });
});
