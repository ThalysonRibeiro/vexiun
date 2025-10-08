
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppSidebar } from "../app-sidebar";
import { deleteWorkspace } from "../../../_actions/delete-workspace";
import { toast } from "sonner";
import { Session } from "next-auth";
import { Workspace } from "@/generated/prisma";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/dashboard"),
  redirect: jest.fn(),
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));
jest.mock("next-auth/react");
jest.mock("../../../_actions/delete-Workspace");
jest.mock("sonner");
jest.mock("../Workspace-form", () => ({
  WorkspaceForm: jest.fn(({ setAddWorkspace }) => (
    <div data-testid="Workspace-form">
      <button onClick={() => setAddWorkspace(false)}>Close Form</button>
    </div>
  )),
}));

const mockDeleteWorkspace = deleteWorkspace as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockUseSession = useSession as jest.Mock;

const mockWorkspaces: Workspace[] = [
  { id: "d-1", title: "Workspace 1", userId: "u-1", createdAt: new Date(), updatedAt: new Date() },
  { id: "d-2", title: "Workspace 2", userId: "u-1", createdAt: new Date(), updatedAt: new Date() },
];

const mockUserData: Session = {
  user: { id: "u-1" },
  expires: "some-future-date",
};

describe("AppSidebar component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({ data: mockUserData, status: "authenticated" });
  });

  const renderComponent = (Workspaces: Workspace[], userData: Session) => {
    return render(
      <SidebarProvider>
        <AppSidebar Workspaces={Workspaces} userData={userData} />
      </SidebarProvider>
    );
  };

  it("should render navigation links and Workspaces", () => {
    renderComponent(mockWorkspaces, mockUserData);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Metas")).toBeInTheDocument();
    expect(screen.getByText("Workspace 1")).toBeInTheDocument();
    expect(screen.getByText("Workspace 2")).toBeInTheDocument();
  });

  it("should show the Workspace form when 'Adicionar Workspace' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent([], mockUserData);

    const addButton = screen.getByText("Adicionar Workspace");
    await user.click(addButton);

    expect(screen.getByTestId("Workspace-form")).toBeInTheDocument();
  });

  it("should show the Workspace form in edit mode when 'Editar' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent(mockWorkspaces, mockUserData);

    const optionsButton = screen.getAllByRole("button", { name: /Opções para/i })[0];
    await user.click(optionsButton);

    const editButton = await screen.findByText("Editar");
    await user.click(editButton);

    expect(screen.getByTestId("Workspace-form")).toBeInTheDocument();
  });

  it("should call deleteWorkspace action and show success toast when 'Deletar' is clicked", async () => {
    const user = userEvent.setup();
    mockDeleteWorkspace.mockResolvedValue({ data: "Success" });
    renderComponent(mockWorkspaces, mockUserData);

    const optionsButton = screen.getAllByRole("button", { name: /Opções para/i })[0];
    await user.click(optionsButton);

    const deleteButton = await screen.findByRole("menuitem", { name: /Deletar/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteWorkspace).toHaveBeenCalledWith("d-1");
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith("Success");
    });
  });

  it("should show an error toast if deleteWorkspace fails", async () => {
    const user = userEvent.setup();
    mockDeleteWorkspace.mockResolvedValue({ error: "Failed to delete" });
    renderComponent(mockWorkspaces, mockUserData);

    const optionsButton = screen.getAllByRole("button", { name: /Opções para/i })[0];
    await user.click(optionsButton);

    const deleteButton = await screen.findByRole("menuitem", { name: /Deletar/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Failed to delete");
    });
  });

  it("should display a message when no Workspaces are available", () => {
    renderComponent([], mockUserData);
    expect(screen.getByText("Nenhuma Workspace criada")).toBeInTheDocument();
  });
});
