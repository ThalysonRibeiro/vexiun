import { render, waitFor } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { getDeviceInfo } from "@/hooks/use-mobile";
import { LoginAlert } from "../login-alert";
import { mockFetch, sessionStorageMock } from "../../test-utils/global-mocks";

// Mock dependencies
jest.mock("next-auth/react", () => ({
  useSession: jest.fn()
}));
jest.mock("@/hooks/use-mobile", () => ({
  getDeviceInfo: jest.fn(() => ({ os: "test-os", browser: "test-browser" }))
}));

describe("LoginAlert", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorageMock.clear();
  });

  it("does not send login alert if no session user email", async () => {
    (useSession as jest.Mock).mockReturnValue({ data: null, status: "unauthenticated" });
    render(<LoginAlert emailNotifications={true} />);

    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled();
      expect(sessionStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  it("does not send login alert if emailNotifications is false", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "test@example.com", name: "Test User" } },
      status: "authenticated"
    });
    render(<LoginAlert emailNotifications={false} />);

    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled();
      expect(sessionStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  it("sends login alert if session exists and emailNotifications is true (first load)", async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "test@example.com", name: "Test User" } },
      status: "authenticated"
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: "Alert sent" })
    });

    render(<LoginAlert emailNotifications={true} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/auth/login-alert",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            name: "Test User",
            deviceInfo: { os: "test-os", browser: "test-browser" }
          })
        })
      );
      expect(sessionStorageMock.setItem).toHaveBeenCalledWith("loginAlertSent", "true");
    });
  });

  it("does not send login alert if already sent in the session", async () => {
    sessionStorageMock.setItem("loginAlertSent", "true");
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "test@example.com", name: "Test User" } },
      status: "authenticated"
    });

    render(<LoginAlert emailNotifications={true} />);

    await waitFor(() => {
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  it("logs an error if the API call fails", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "test@example.com", name: "Test User" } },
      status: "authenticated"
    });
    mockFetch.mockRejectedValueOnce(new Error("API Error"));

    render(<LoginAlert emailNotifications={true} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao enviar alerta de login:",
        expect.any(Error)
      );
    });
    consoleErrorSpy.mockRestore();
  });
});
