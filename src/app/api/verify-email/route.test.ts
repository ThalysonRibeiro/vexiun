import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { GET } from "./route";

jest.mock("@/lib/prisma", () => ({
  user: {
    findFirst: jest.fn(),
    update: jest.fn()
  }
}));

describe("API Route: /api/verify-email", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should verify email and return a success message", async () => {
    const token = "testToken";
    const user = { id: "1", email: "test@example.com", name: "Test User" };

    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      ...user,
      verificationExpiresAt: new Date(Date.now() + 10000)
    });

    const request = new NextRequest(`http://localhost/api/verify-email?token=${token}`, {
      method: "GET"
    });
    const response = await GET(request);
    const responseBody = await response.json();

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { emailVerificationToken: token }
    });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: user.id },
      data: {
        emailVerified: expect.any(Date),
        emailVerificationToken: null,
        verificationExpiresAt: null
      }
    });
    expect(response.status).toBe(200);
    expect(responseBody).toEqual({
      success: true,
      message: "E-mail verificado com sucesso"
    });
  });

  it("should return 400 if token is not provided", async () => {
    const request = new NextRequest("http://localhost/api/verify-email", {
      method: "GET"
    });
    const response = await GET(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ error: "Token inválido" });
    expect(prisma.user.findFirst).not.toHaveBeenCalled();
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("should return 400 if token is invalid or not found", async () => {
    const token = "invalidToken";
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

    const request = new NextRequest(`http://localhost/api/verify-email?token=${token}`, {
      method: "GET"
    });
    const response = await GET(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ error: "Token inválido ou expirado" });
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { emailVerificationToken: token }
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("should return 400 if token is expired", async () => {
    const token = "expiredToken";
    const user = { id: "1", email: "test@example.com", name: "Test User" };
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({
      ...user,
      verificationExpiresAt: new Date(Date.now() - 10000)
    });

    const request = new NextRequest(`http://localhost/api/verify-email?token=${token}`, {
      method: "GET"
    });
    const response = await GET(request);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ error: "Token inválido ou expirado" });
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { emailVerificationToken: token }
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it("should return 500 on internal server error", async () => {
    const token = "testToken";
    (prisma.user.findFirst as jest.Mock).mockRejectedValue(new Error("Database error"));

    const request = new NextRequest(`http://localhost/api/verify-email?token=${token}`, {
      method: "GET"
    });
    const response = await GET(request);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody).toEqual({ error: "Erro interno do servidor" });
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { emailVerificationToken: token }
    });
    expect(prisma.user.update).not.toHaveBeenCalled();
  });
});
