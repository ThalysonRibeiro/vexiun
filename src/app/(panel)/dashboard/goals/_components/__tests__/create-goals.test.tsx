import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateGoals } from "../create-goals";
import { createGoal } from "../../_actions/create-goal";
import { toast } from "sonner";
import { useMobile } from "@/hooks/use-mobile";
import { Sheet } from "@/components/ui/sheet";

// Mock dependencies
jest.mock("../../_actions/create-goal");
jest.mock("sonner");
jest.mock("@/hooks/use-mobile");

const mockCreateGoal = createGoal as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockUseMobile = useMobile as jest.Mock;

// A simple wrapper to provide the necessary context for SheetContent
const renderInSheet = (ui: React.ReactElement) => {
  return render(<Sheet open={true}>{ui}</Sheet>);
};

describe("CreateGoals Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMobile.mockReturnValue(false); // Default to Workspace
  });

  it("should render the form correctly", () => {
    renderInSheet(<CreateGoals />);
    expect(screen.getByText("Cadastrar meta")).toBeInTheDocument();
    expect(screen.getByLabelText("Qual a atividade")).toBeInTheDocument();
    expect(screen.getByText("Quantas vezes na semana")).toBeInTheDocument();
  });

  it("should call createGoal on form submission", async () => {
    mockCreateGoal.mockResolvedValue({ data: "Success!" });
    renderInSheet(<CreateGoals />);

    fireEvent.change(screen.getByLabelText("Qual a atividade"), { target: { value: "New Goal" } });
    fireEvent.click(screen.getByText("3x na semana"));
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(mockCreateGoal).toHaveBeenCalledWith({ title: "New Goal", desiredWeeklyFrequency: 3 });
      expect(mockToastSuccess).toHaveBeenCalledWith("Success!");
    });
  });

  it("should show error toast if createGoal fails", async () => {
    mockCreateGoal.mockResolvedValue({ error: "Failure!" });
    renderInSheet(<CreateGoals />);

    fireEvent.change(screen.getByLabelText("Qual a atividade"), { target: { value: "Bad Goal" } });
    fireEvent.click(screen.getByText("1x na semana"));
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Failure!");
    });
  });

  it("should render Select for mobile", () => {
    mockUseMobile.mockReturnValue(true);
    renderInSheet(<CreateGoals />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });
});