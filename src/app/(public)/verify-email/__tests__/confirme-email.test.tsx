import { render, screen, waitFor, act } from "@testing-library/react";
import { useSearchParams, useRouter } from "next/navigation";
import { ConfirmEmailConmponent } from "../_components/confirme-email";
import { mockFetch } from "@/test-utils/global-mocks";

describe("ConfirmEmailConmponent", () => {
  const mockUseSearchParams = useSearchParams as jest.Mock;
  const mockUseRouter = useRouter as jest.Mock;
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    mockUseRouter.mockReturnValue({ push: mockRouterPush });
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ token: "some-token" })); // Default token for most tests
    mockFetch.mockClear();
    mockRouterPush.mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should show loading state initially", async () => {
    // Mock fetch to never resolve to keep the loading state
    mockFetch.mockReturnValue(new Promise(() => {}));

    mockUseSearchParams.mockReturnValue(new URLSearchParams({ token: "some-token" }));
    await act(async () => {
      render(<ConfirmEmailConmponent />);
    });
    expect(screen.getByText("Verificando seu e-mail...")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("should show success message when token is valid", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ token: "valid-token" }));
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "E-mail confirmado com sucesso!" })
    });

    await act(async () => {
      render(<ConfirmEmailConmponent />);
    });

    await waitFor(() => {
      expect(screen.getByText("E-mail Verificado!")).toBeInTheDocument();
    });

    expect(screen.getByText("E-mail confirmado com sucesso!")).toBeInTheDocument();
    expect(screen.getByText(/Redirecionando para a página de login em/)).toBeInTheDocument();
  });

  it("should show error message when token is invalid (API error)", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ token: "invalid-token" }));
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Token inválido." })
    });

    await act(async () => {
      render(<ConfirmEmailConmponent />);
    });

    await waitFor(() => {
      expect(screen.getByText("Erro na Verificação")).toBeInTheDocument();
    });

    expect(screen.getByText("Token inválido.")).toBeInTheDocument();
    expect(screen.getByText("Tentar Novamente")).toBeInTheDocument();
    expect(screen.getByText("Voltar à Página Inicial")).toBeInTheDocument();
  });

  it("should show error message when fetch fails (network error)", async () => {
    // Temporarily mock console.error for this specific test
    const originalConsoleError = console.error;
    console.error = jest.fn();

    mockUseSearchParams.mockReturnValue(new URLSearchParams({ token: "any-token" }));
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    await act(async () => {
      render(<ConfirmEmailConmponent />);
    });

    await waitFor(() => {
      expect(screen.getByText("Erro na Verificação")).toBeInTheDocument();
    });

    expect(screen.getByText("Erro de conexão. Tente novamente.")).toBeInTheDocument();
    expect(screen.getByText("Tentar Novamente")).toBeInTheDocument();
    expect(screen.getByText("Voltar à Página Inicial")).toBeInTheDocument();

    // Assert that console.error was called with the expected message
    expect(console.error).toHaveBeenCalledWith("Erro na requisição:", expect.any(Error));

    // Restore console.error after this test
    console.error = originalConsoleError;
  });

  it("should show error message when token is not found", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams());
    await act(async () => {
      render(<ConfirmEmailConmponent />);
    });

    await waitFor(() => {
      expect(screen.getByText("Erro na Verificação")).toBeInTheDocument();
    });

    expect(screen.getByText("Token de verificação não encontrado.")).toBeInTheDocument();
  });

  it("should redirect to home page after countdown on success", async () => {
    mockUseSearchParams.mockReturnValue(new URLSearchParams({ token: "valid-token" }));
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "Success" })
    });

    await act(async () => {
      render(<ConfirmEmailConmponent />);
    });

    await waitFor(() => {
      screen.getByText("Ir para Login Agora").click();
    });

    expect(mockRouterPush).toHaveBeenCalledWith("/");
  });
});
