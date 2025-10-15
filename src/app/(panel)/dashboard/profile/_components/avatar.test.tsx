import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Avatar from "./avatar";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { updateAvatar } from "@/app/actions/user";

// Mock dependencies
jest.mock("next-auth/react");
jest.mock("@/app/actions/user");
jest.mock("sonner");
global.fetch = jest.fn();

const mockUseSession = useSession as jest.Mock;
const mockUpdateAvatar = updateAvatar as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockFetch = global.fetch as jest.Mock;

describe("Avatar Component", () => {
  const mockUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({ update: mockUpdate, data: null, status: "authenticated" });
  });

  it("should render the initial avatar image", () => {
    render(<Avatar avatarUrl="/initial-avatar.png" userId="user-123" />);
    const image = screen.getByAltText("imagem de perfil");
    expect(image).toHaveAttribute("src", expect.stringContaining("initial-avatar.png"));
  });

  it("should render a placeholder if no avatarUrl is provided", () => {
    render(<Avatar avatarUrl={null} userId="user-123" />);
    expect(screen.queryByAltText("imagem de perfil")).not.toBeInTheDocument();
    expect(screen.getByTitle("Alterar imagem de perfil")).toBeInTheDocument();
  });

  it("should handle valid image upload successfully", async () => {
    // Mock the fetch call for image upload
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ secure_url: "http://example.com/new.png" })
    });
    mockUpdateAvatar.mockResolvedValue({ success: true });

    render(<Avatar avatarUrl={null} userId="user-123" />);

    const file = new File(["(⌐□_□)"], "new-avatar.png", { type: "image/png" });
    const input = screen.getByTitle("Alterar imagem de perfil");

    // Simulate file upload
    fireEvent.change(input, { target: { files: [file] } });

    // Loading state should appear
    await waitFor(() => expect(screen.getByTestId("loader-spin")).toBeInTheDocument());

    // Wait for all async operations to complete
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockUpdateAvatar).toHaveBeenCalledWith({ avatarUrl: "http://example.com/new.png" });
    });
    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({ image: "http://example.com/new.png" });
    });

    // New image should be displayed
    const image = await screen.findByAltText("imagem de perfil");
    expect(image).toHaveAttribute("src", expect.stringContaining("new.png"));
  });

  it("should show an error toast for invalid file type", async () => {
    render(<Avatar avatarUrl={null} userId="user-123" />);

    const file = new File(["text"], "document.txt", { type: "text/plain" });
    const input = screen.getByTitle("Alterar imagem de perfil");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Formato inválido");
    });

    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockUpdateAvatar).not.toHaveBeenCalled();
  });

  it("should show an error toast if image upload fails", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, json: async () => ({}) });
    render(<Avatar avatarUrl={null} userId="user-123" />);

    const file = new File(["(⌐□_□)"], "new-avatar.png", { type: "image/png" });
    const input = screen.getByTitle("Alterar imagem de perfil");

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Falha ao alterar imagem");
    });

    expect(mockUpdateAvatar).not.toHaveBeenCalled();
  });
});

// Add a data-testid to the loader for easier selection
jest.mock("lucide-react", () => {
  const original = jest.requireActual("lucide-react");
  return {
    ...original,
    Loader2: (props: React.SVGProps<SVGSVGElement>) => <original.Loader2 {...props} data-testid="loader-spin" />,
  };
});
