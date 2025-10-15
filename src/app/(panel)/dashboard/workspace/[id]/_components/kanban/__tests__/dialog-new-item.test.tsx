import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DialogContentNewItem } from "../dialog-new-item";
import { toast } from "sonner";
import { Group, Priority, Status } from "@/generated/prisma";
import { Dialog } from "@/components/ui/dialog";
import { createItem } from "@/app/actions/item";

type ItemFormData = {
  title: string;
  notes?: string;
  description?: string;
  priority: Priority;
  term: Date;
};

// Mock dependencies
jest.mock("sonner");

// Mock react-hook-form
const mockReset = jest.fn();
const mockHandleSubmit = jest.fn((fn) => (e: React.FormEvent) => {
  e.preventDefault();
  const formData = {
    title: "Mocked Item",
    notes: "Mocked notes",
    description: "Mocked description",
    priority: "MEDIUM" as Priority,
    term: new Date("2025-01-01"),
  };
  fn(formData);
});

jest.mock("../../main-board/use-item-form", () => ({
  UseItemForm: () => ({
    handleSubmit: mockHandleSubmit,
    control: {
      _formState: {
        errors: {},
      },
      _fields: {},
      _names: {
        array: new Set(),
        mount: new Set(),
      },
    },
    reset: mockReset,
    formState: {
      errors: {},
    },
  }),
}));

// Types for form components
interface FormProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

interface FormFieldProps {
  render: (props: { field: FieldProps }) => React.ReactNode;
  name: string;
}

interface FieldProps {
  value: string | Date;
  onChange: jest.Mock;
  onBlur: jest.Mock;
  name: string;
}

interface FormChildrenProps {
  children: React.ReactNode;
}

// Mock form components
jest.mock("@/components/ui/form", () => ({
  Form: ({ children, ...props }: FormProps) => <div {...props}>{children}</div>,
  FormField: ({ render, name }: FormFieldProps) => {
    const field: FieldProps = {
      value: name === "priority" ? "MEDIUM" : name === "term" ? new Date("2025-01-01") : "",
      onChange: jest.fn(),
      onBlur: jest.fn(),
      name,
    };
    return render({ field });
  },
  FormItem: ({ children }: FormChildrenProps) => <div>{children}</div>,
  FormLabel: ({ children }: FormChildrenProps) => <label>{children}</label>,
  FormControl: ({ children }: FormChildrenProps) => <div>{children}</div>,
  FormDescription: () => null,
  FormMessage: () => null,
}));

const mockCreateItem = createItem as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;

const mockGroups: Group[] = [
  { id: "group-1", title: "Group One" } as Group,
  { id: "group-2", title: "Group Two" } as Group,
];

// Helper function to render with Dialog wrapper
const renderWithDialog = (component: React.ReactElement) => {
  return render(
    <Dialog open={true}>
      {component}
    </Dialog>
  );
};

describe("DialogContentNewItem Component", () => {
  const mockCloseDialog = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the form with default values", () => {
    renderWithDialog(
      <DialogContentNewItem
        closeDialog={mockCloseDialog}
        groups={mockGroups}
        status={"NOT_STARTED" as Status}
      />
    );

    expect(screen.getByText("Criar novo item")).toBeInTheDocument();
    expect(screen.getByText("Group One")).toBeInTheDocument(); // Default group shown in select
    expect(screen.getByText("Titulo")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cadastrar" })).toBeInTheDocument();
  });

  it("should call createItem with correct data on submit", async () => {
    mockCreateItem.mockResolvedValue({ data: { id: "new-item" } });
    renderWithDialog(
      <DialogContentNewItem
        closeDialog={mockCloseDialog}
        groups={mockGroups}
        status={"IN_PROGRESS" as Status}
      />
    );

    const submitButton = screen.getByRole("button", { name: "Cadastrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateItem).toHaveBeenCalledWith({
        groupId: "group-1",
        title: "Mocked Item",
        term: new Date("2025-01-01"),
        priority: "MEDIUM",
        status: "IN_PROGRESS",
        notes: "Mocked notes",
        description: "Mocked description",
      });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith("Item cadastrado com sucesso!");
      expect(mockCloseDialog).toHaveBeenCalledWith(false);
      expect(mockReset).toHaveBeenCalled();
    });
  });

  it("should show an error toast if createItem fails", async () => {
    mockCreateItem.mockResolvedValue({ error: "Creation failed" });
    renderWithDialog(
      <DialogContentNewItem
        closeDialog={mockCloseDialog}
        groups={mockGroups}
        status={"NOT_STARTED" as Status}
      />
    );

    const submitButton = screen.getByRole("button", { name: "Cadastrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Erro ao cadastrar item");
    });

    expect(mockCloseDialog).not.toHaveBeenCalled();
    expect(mockReset).not.toHaveBeenCalled();
  });

  it("should handle unexpected errors", async () => {
    mockCreateItem.mockRejectedValue(new Error("Unexpected error"));
    renderWithDialog(
      <DialogContentNewItem
        closeDialog={mockCloseDialog}
        groups={mockGroups}
        status={"NOT_STARTED" as Status}
      />
    );

    const submitButton = screen.getByRole("button", { name: "Cadastrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Erro inesperado");
    });
  });

  it("should use default group if no group is selected", async () => {
    mockCreateItem.mockResolvedValue({ data: { id: "new-item" } });
    renderWithDialog(
      <DialogContentNewItem
        closeDialog={mockCloseDialog}
        groups={mockGroups}
        status={"NOT_STARTED" as Status}
      />
    );

    const submitButton = screen.getByRole("button", { name: "Cadastrar" });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockCreateItem).toHaveBeenCalledWith(
        expect.objectContaining({
          groupId: "group-1", // Should use first group as default
        })
      );
    });
  });
});