import { POST } from "./route";
import prisma from "@/lib/prisma";
import { sendVerificationEmail } from "@/services/email.service";
import { NextResponse, NextRequest } from "next/server";

jest.mock("@/lib/prisma", () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn()
  }
}));

jest.mock("@/services/email.service", () => ({
  sendVerificationEmail: jest.fn()
}));

describe("API Route: /api/auth/send-verification", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should send a verification email and return a success message", async () => {
    const email = "test@example.com";
    const user = { id: "1", email, name: "Test User" };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (sendVerificationEmail as jest.Mock).mockResolvedValue(undefined);

    const request = new NextRequest("http://localhost/api/auth/send-verification", {
      method: "POST",
      body: JSON.stringify({ email })
    });

    const response = await POST(request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email },
      data: {
        emailVerificationToken: expect.any(String),
        verificationExpiresAt: expect.any(Date)
      }
    });
    expect(sendVerificationEmail).toHaveBeenCalledWith(email, expect.any(String), user.name);
    expect(NextResponse.json).toHaveBeenCalledWith({
      message: "E-mail send"
    });
    expect(response.status).toBe(200);
  });

  it("should return a 400 error if email is not provided", async () => {
    const request = new NextRequest("http://localhost/api/auth/send-verification", {
      method: "POST",
      body: JSON.stringify({})
    });

    const response = await POST(request);

    expect(NextResponse.json).toHaveBeenCalledWith({ error: "Email is required" }, { status: 400 });
    expect(response.status).toBe(400);
  });

  it("should return a 404 error if the user is not found", async () => {
    const email = "nonexistent@example.com";

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest("http://localhost/api/auth/send-verification", {
      method: "POST",
      body: JSON.stringify({ email })
    });

    const response = await POST(request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
    expect(NextResponse.json).toHaveBeenCalledWith({ error: "User not found" }, { status: 404 });
    expect(response.status).toBe(404);
  });

  it("should handle errors from sendVerificationEmail", async () => {
    const email = "test@example.com";
    const user = { id: "1", email, name: "Test User" };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (sendVerificationEmail as jest.Mock).mockRejectedValue(new Error("Failed to send email"));

    const request = new NextRequest("http://localhost/api/auth/send-verification", {
      method: "POST",
      body: JSON.stringify({ email })
    });

    await expect(POST(request)).rejects.toThrow("Failed to send email");
  });

  it("should handle errors from prisma.user.findUnique", async () => {
    const email = "test@example.com";

    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error("Database error"));

    const request = new NextRequest("http://localhost/api/auth/send-verification", {
      method: "POST",
      body: JSON.stringify({ email })
    });

    await expect(POST(request)).rejects.toThrow("Database error");
  });

  it("should handle errors from prisma.user.update", async () => {
    const email = "test@example.com";
    const user = { id: "1", email, name: "Test User" };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (prisma.user.update as jest.Mock).mockRejectedValue(new Error("Database error"));

    const request = new NextRequest("http://localhost/api/auth/send-verification", {
      method: "POST",
      body: JSON.stringify({ email })
    });

    await expect(POST(request)).rejects.toThrow("Database error");
  });
});
