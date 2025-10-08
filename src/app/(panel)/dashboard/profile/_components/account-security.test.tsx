import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AccountSecurity from "./account-security";
import { updateSettings } from "../_actions/update-settings";
import { toast } from "sonner";
import { UserWithCounts } from "../types/profile-types";

// Mock Intl.supportedValuesOf for the test environment
Object.defineProperty(Intl, "supportedValuesOf", {
  value: (key: string) => {
    if (key === "timeZone") {
      return ["America/Sao_Paulo", "America/New_York", "Europe/London"];
    }
    return [];
  },
  writable: true,
});

// Mock dependencies
jest.mock("../_actions/update-settings");
jest.mock("sonner");

// Mock fetch for sendVerificationEmail
global.fetch = jest.fn();

const mockUpdateSettings = updateSettings as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
toast.promise = jest.fn().mockResolvedValue(undefined); // Mock toast.promise

const createMockUser = (isVerified: boolean): UserWithCounts => ({
  id: "user-123",
  email: "test@example.com",
  emailVerified: isVerified ? new Date() : null,
  userSettings: {
    emailNotifications: true,
    pushNotifications: false,
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
  },
} as UserWithCounts);

describe("AccountSecurity Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockClear();
  });

  describe("Email Verification", () => {
    it("should show 'Verified' status for a verified user", () => {
      render(<AccountSecurity detailUser={createMockUser(true)} />);
      expect(screen.getByText("Email verificado")).toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /reenviar/i })).not.toBeInTheDocument();
    });

    it("should show 'Not Verified' status and a button for an unverified user", () => {
      render(<AccountSecurity detailUser={createMockUser(false)} />);
      expect(screen.getByText("E-mail não verificado")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /reenviar/i })).toBeInTheDocument();
    });

    it("should call fetch to send verification email when button is clicked", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
      render(<AccountSecurity detailUser={createMockUser(false)} />);

      const button = screen.getByRole("button", { name: /reenviar/i });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith("/api/auth/send-verification", expect.any(Object));
        expect(toast.promise).toHaveBeenCalled();
      });
    });
  });

  describe("Settings Form", () => {
    it("should render the form with initial values from props", () => {
      render(<AccountSecurity detailUser={createMockUser(true)} />);
      expect(screen.getByLabelText(/ativar alerta/i)).toBeChecked();
      expect(screen.getAllByText("America/Sao_Paulo").length).toBeGreaterThan(0);
    });

    it("should call updateSettings on form submission", async () => {
      mockUpdateSettings.mockResolvedValue({ success: "OK" });
      render(<AccountSecurity detailUser={createMockUser(true)} />);

      const alertSwitch = screen.getByLabelText(/ativar alerta/i);
      fireEvent.click(alertSwitch); // Toggle it to false

      const saveButton = screen.getByRole("button", { name: /salvar/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockUpdateSettings).toHaveBeenCalledWith({
          userId: "user-123",
          emailNotifications: false, // It was toggled
          pushNotifications: false,
          language: "pt-BR",
          timezone: "America/Sao_Paulo",
        });
      });

      await waitFor(() => {
        expect(mockToastSuccess).toHaveBeenCalledWith("OK");
      });
    });

    it("should show an error toast if updateSettings fails", async () => {
      mockUpdateSettings.mockResolvedValue({ error: "Settings update failed" });
      render(<AccountSecurity detailUser={createMockUser(true)} />);

      fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

      await waitFor(() => {
        expect(mockToastError).toHaveBeenCalledWith("Settings update failed");
      });
    });

    it("should return null if UserSettings are not provided", () => {
      const userWithoutSettings = { ...createMockUser(true), userSettings: null };
      const { container } = render(<AccountSecurity detailUser={userWithoutSettings} />);
      expect(container).toBeEmptyDOMElement();
    });
  });
});
