import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { NameForme } from "./name-form";
import { updateName } from "../_actions/update-name";
import { toast } from "sonner";
import { User } from "next-auth";

// Mock dependencies
jest.mock("../_actions/update-name");
jest.mock("sonner");

const mockUpdateName = updateName as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;

const mockUser: User = {
  id: "user-123",
  name: "Initial Name",
};

describe("NameForme Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should display the initial name and switch to edit mode on click", () => {
    render(<NameForme user={mockUser} />);

    // Initially shows name
    expect(screen.getByText("Initial Name")).toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

    // Click to enter edit mode
    fireEvent.click(screen.getByText("Initial Name"));

    expect(screen.getByRole("textbox")).toHaveValue("Initial Name");
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
  });

  it("should call updateName action on form submission and show success toast", async () => {
    mockUpdateName.mockResolvedValue({ success: true }); // Assuming a success object
    render(<NameForme user={mockUser} />);

    // Enter edit mode and submit
    fireEvent.click(screen.getByText("Initial Name"));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New Name" } });
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(mockUpdateName).toHaveBeenCalledWith({ userId: "user-123", name: "New Name" });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith("Nome alterado com sucesso!");
    });

    // Form should be hidden after success
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("should show an error toast if updateName action returns an error", async () => {
    mockUpdateName.mockResolvedValue({ error: "Update failed" });
    render(<NameForme user={mockUser} />);

    fireEvent.click(screen.getByText("Initial Name"));
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "New Name" } });
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(mockUpdateName).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Update failed");
    });
  });

  it("should show an error toast if updateName action throws an error", async () => {
    mockUpdateName.mockRejectedValue(new Error("Something went wrong"));
    render(<NameForme user={mockUser} />);

    fireEvent.click(screen.getByText("Initial Name"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "New Name" } });
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Erro ao atualizar nome");
    });
  });
});
