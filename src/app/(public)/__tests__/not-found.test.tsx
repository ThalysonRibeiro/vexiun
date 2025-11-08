import { render, screen } from "@testing-library/react";
import NotFound from "../../not-found";

describe("NotFound component", () => {
  it("should render the 404 page with a link to the dashboard", () => {
    render(<NotFound />);

    expect(screen.getByRole("heading", { level: 1, name: /404/i })).toBeInTheDocument();
    expect(
      screen.getByText("Oops, a página que você está procurando não foi encontrada.")
    ).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /Voltar para o Início/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/dashboard");
  });
});
