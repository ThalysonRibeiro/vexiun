import { render, screen } from "@testing-library/react";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";
import Profile from "./page";
import { ProfileContent } from "./_components/profile-content";
import { UserWithCounts } from "./types/profile-types";
import { Session } from "next-auth";
import { getDetailUser } from "@/app/data-access/user";

// Mock dependencies
jest.mock("next/navigation");
jest.mock("@/lib/getSession");
jest.mock("@/app/data-access/user");

// Mock the client component to isolate the server component"s logic
jest.mock("./_components/profile-content", () => ({
  ProfileContent: jest.fn(({ sessionUser, detailUser }) => (
    <div data-testid="profile-content">
      <span data-testid="session-user-email">{sessionUser.email}</span>
      <span data-testid="detail-user-id">{detailUser.id}</span>
    </div>
  )),
}));

// Type-safe mock functions
const mockGetSession = getSession as unknown as jest.Mock<Promise<Session | null>>;
const mockGetDetailUser = getDetailUser as jest.MockedFunction<typeof getDetailUser>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;
const MockProfileContent = ProfileContent as jest.Mock;

// Mock data
const mockSession: Session = {
  user: {
    id: "user-123",
    name: "Test User",
    email: "test@example.com",
    image: "avatar.jpg",
  },
  expires: new Date(Date.now() + 86400 * 1000).toISOString(),
};

const mockDetailUser: UserWithCounts = {
  id: "user-123",
  name: "Test User",
  email: "test@example.com",
  image: "avatar.jpg",
  emailVerified: new Date(),
  emailVerificationToken: null,
  verificationExpiresAt: null,
  role: "USER",
  isActive: true,
  createdBy: null,
  acceptTerms: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  _count: {
    sessions: 5,
  },
  goals: [],
  userSettings: {
    id: "settings-123",
    userId: "user-123",
    pushNotifications: true,
    emailNotifications: true,
    language: "pt-BR",
    timezone: "America/Sao_Paulo",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

describe("Profile Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should redirect to '/' if session is not found", async () => {
      mockGetSession.mockResolvedValue(null);
      mockRedirect.mockImplementation(() => {
        throw new Error("NEXT_REDIRECT");
      });

      await expect(Profile()).rejects.toThrow("NEXT_REDIRECT");
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });

    it("should return null if session exists but session.user is null", async () => {
      mockGetSession.mockResolvedValue({ ...mockSession, user: undefined });

      const result = await Profile();
      expect(result).toBeNull(); // Expect null when session.user is undefined
      expect(mockGetDetailUser).not.toHaveBeenCalled();
    });
  });

  describe("Data Fetching", () => {
    it("should call getDetailUser when session is valid", async () => {
      mockGetSession.mockResolvedValue(mockSession);
      mockGetDetailUser.mockResolvedValue(mockDetailUser);

      await Profile();

      expect(getDetailUser).toHaveBeenCalledTimes(1);
    });

    it("should return null if getDetailUser returns null", async () => {
      mockGetSession.mockResolvedValue(mockSession);
      mockGetDetailUser.mockResolvedValue(null);

      const result = await Profile();

      expect(result).toBeNull();
    });
  });

  describe("Rendering", () => {
    it("should render ProfileContent with correct props on successful data fetch", async () => {
      mockGetSession.mockResolvedValue(mockSession);
      mockGetDetailUser.mockResolvedValue(mockDetailUser);

      const PageComponent = await Profile();
      render(PageComponent as React.ReactElement);

      expect(MockProfileContent).toHaveBeenCalledWith(
        {
          sessionUser: mockSession.user,
          detailUser: mockDetailUser,
        },
        undefined
      );

      expect(screen.getByTestId("profile-content")).toBeInTheDocument();
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      expect(screen.getByTestId("session-user-email")).toHaveTextContent(mockSession.user?.email!);
      expect(screen.getByTestId("detail-user-id")).toHaveTextContent(mockDetailUser.id);
    });
  });
});