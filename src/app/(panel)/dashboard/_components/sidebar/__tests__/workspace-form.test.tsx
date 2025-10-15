
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WorkspaceForm } from "../workspace-form";
import { toast } from "sonner";
import { createWorkspace, updateWorkspace } from "@/app/actions/workspace";

jest.mock("@/app/actions/workspace/create-Workspace");
jest.mock("@/app/actions/workspace/update-Workspace");
jest.mock("sonner");

const mockCreateWorkspace = createWorkspace as jest.Mock;
const mockUpdateWorkspace = updateWorkspace as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;

describe("WorkspaceForm component", () => {
  let setAddWorkspace: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    setAddWorkspace = jest.fn();
  });

  it("should render in create mode and call createWorkspace on submit", async () => {
    mockCreateWorkspace.mockResolvedValue({ newWorkspace: { id: "1", title: "New Workspace" } });
    render(<WorkspaceForm setAddWorkspace={setAddWorkspace} />);

    const input = screen.getByPlaceholderText("Digite o nome da Workspace");
    const form = input.closest("form");

    fireEvent.change(input, { target: { value: "New Workspace" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockCreateWorkspace).toHaveBeenCalledWith({ title: "New Workspace" });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith("Workspace cadastrada com sucesso!");
      expect(setAddWorkspace).toHaveBeenCalledWith(false);
    });
  });

  it("should render in update mode and call updateWorkspace on submit", async () => {
    mockUpdateWorkspace.mockResolvedValue({ data: "Success" });
    const initialValues = { title: "Old Workspace" };
    render(
      <WorkspaceForm
        setAddWorkspace={setAddWorkspace}
        workspaceId="Workspace-123"
        initialValues={initialValues}
      />
    );

    const input = screen.getByDisplayValue("Old Workspace");
    const form = input.closest("form");

    fireEvent.change(input, { target: { value: "Updated Workspace" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockUpdateWorkspace).toHaveBeenCalledWith({
        workspaceId: "Workspace-123",
        title: "Updated Workspace",
      });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith("Success");
      expect(setAddWorkspace).toHaveBeenCalledWith(false);
    });
  });

  it("should handle error on createWorkspace failure", async () => {
    mockCreateWorkspace.mockResolvedValue({ error: "Creation failed" });
    render(<WorkspaceForm setAddWorkspace={setAddWorkspace} />);

    const input = screen.getByPlaceholderText("Digite o nome da Workspace");
    const form = input.closest("form");

    fireEvent.change(input, { target: { value: "New Workspace" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Erro ao cadastrar Workspace");
    });
  });

  it("should call setAddWorkspace(false) when clicking outside", () => {
    render(<WorkspaceForm setAddWorkspace={setAddWorkspace} />);

    fireEvent.mouseDown(document.body);

    expect(setAddWorkspace).toHaveBeenCalledWith(false);
  });
});
