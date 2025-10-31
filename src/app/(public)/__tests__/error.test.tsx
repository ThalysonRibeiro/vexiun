import { render, screen, fireEvent } from "@testing-library/react";
import { ErrorContent } from "../../error";

describe("GlobalError component", () => {
  it("should render the error message and call reset on button click", () => {
    const mockError = new Error("Test error message");
    const mockReset = jest.fn();

    render(<ErrorContent error={mockError} reset={mockReset} />);

    expect(screen.getByText("Oops, algo deu errado!")).toBeInTheDocument();
    expect(
      screen.getByText(/Lamentamos, mas parece que ocorreu um erro inesperado/)
    ).toBeInTheDocument();

    expect(screen.getByText("Detalhes do erro:")).toBeInTheDocument();
    expect(screen.getByText("Test error message")).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /Tente Novamente/i });
    expect(resetButton).toBeInTheDocument();

    fireEvent.click(resetButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
