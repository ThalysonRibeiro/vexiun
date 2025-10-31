import { handleRegister } from "../signIn";
import { signIn } from "@/lib/auth";

jest.mock("@/lib/auth", () => ({
  signIn: jest.fn()
}));

describe("handleRegister", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("calls signIn with 'github' provider and correct redirect options", async () => {
    await handleRegister("github");
    expect(signIn).toHaveBeenCalledWith("github", {
      redirectTo: "/dashboard",
      callbackUrl: "/dashboard"
    });
  });

  it("calls signIn with 'google' provider and correct redirect options", async () => {
    await handleRegister("google");
    expect(signIn).toHaveBeenCalledWith("google", {
      redirectTo: "/dashboard",
      callbackUrl: "/dashboard"
    });
  });
});
