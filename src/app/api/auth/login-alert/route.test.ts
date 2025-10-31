import { POST } from "./route";
import { NextRequest } from "next/server";
import { sendLoginAlertEmail } from "@/services/email.service";
import { mockFetch } from "@/test-utils/global-mocks";

// Mock a dependência sendLoginAlertEmail
jest.mock("@/services/email.service", () => ({
  sendLoginAlertEmail: jest.fn()
}));

describe("API Route: /api/auth/login-alert", () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  it("should send a login alert and return 200 on success", async () => {
    const mockRequest = {
      json: async () => ({
        email: "test@example.com",
        name: "Test User",
        userAgent: "Test Agent",
        deviceInfo: { userAgent: "Device Agent" }
      }),
      headers: new Headers({
        "x-forwarded-for": "123.123.123.123"
      })
    } as unknown as NextRequest;

    // Mock da resposta da API de geolocalização
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "success",
        city: "Test City",
        regionName: "Test Region",
        country: "Test Country"
      })
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody).toEqual({
      success: true,
      message: "Alerta de login enviado com sucesso"
    });

    expect(sendLoginAlertEmail).toHaveBeenCalledTimes(1);
    expect(sendLoginAlertEmail).toHaveBeenCalledWith(
      "test@example.com",
      "Test User",
      expect.objectContaining({
        ip: "123.123.123.123",
        location: "Test City, Test Region, Test Country",
        userAgent: "Device Agent"
      })
    );
  });

  it("should return 400 if email is not provided", async () => {
    const mockRequest = {
      json: async () => ({
        name: "Test User"
      }),
      headers: new Headers()
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody).toEqual({ error: "Email é obrigatório" });
    expect(sendLoginAlertEmail).not.toHaveBeenCalled();
  });

  it("should handle geolocation API failure and continue execution", async () => {
    const mockRequest = {
      json: async () => ({
        email: "test@example.com",
        name: "Test User"
      }),
      headers: new Headers({
        "x-real-ip": "123.123.123.123"
      })
    } as unknown as NextRequest;

    // Mock de falha na API de geolocalização
    mockFetch.mockResolvedValueOnce({
      ok: false
    });

    const response = await POST(mockRequest);

    expect(response.status).toBe(200);

    expect(sendLoginAlertEmail).toHaveBeenCalledWith(
      "test@example.com",
      "Test User",
      expect.objectContaining({
        location: "Desconhecida"
      })
    );
  });

  it("should return 500 if an internal error occurs", async () => {
    const mockRequest = {
      json: async () => ({
        email: "test@example.com",
        name: "Test User"
      }),
      headers: new Headers()
    } as unknown as NextRequest;

    // Força um erro no serviço de email
    (sendLoginAlertEmail as jest.Mock).mockRejectedValueOnce(new Error("Erro de envio"));

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody).toEqual({ error: "Erro interno do servidor" });
  });
});
