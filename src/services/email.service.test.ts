import { transporter } from "@/lib/mailer";
import { sendLoginAlertEmail, sendVerificationEmail } from "./email.service";

// Mock the transporter from @/lib/mailer
jest.mock("@/lib/mailer", () => ({
  transporter: {
    sendMail: jest.fn()
  }
}));

describe("Email Service", () => {
  const originalEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_URL: "http://localhost:3000",
      MAIL_USER: "test@example.com"
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("sendVerificationEmail", () => {
    it("should send a verification email with correct details", async () => {
      (transporter.sendMail as jest.Mock).mockResolvedValueOnce({});

      const to = "user@example.com";
      const token = "test-token";
      const name = "Test User";

      await sendVerificationEmail(to, token, name);

      expect(transporter.sendMail).toHaveBeenCalledTimes(1);
      const mailOptions = (transporter.sendMail as jest.Mock).mock.calls[0][0];

      expect(mailOptions.from).toBe("test@example.com");
      expect(mailOptions.to).toBe(to);
      expect(mailOptions.subject).toBe("Verificação de Email");
      expect(mailOptions.html).toContain("Olá, Test User! 👋");
      expect(mailOptions.html).toContain("http://localhost:3000/verify-email?token=test-token");
    });

    it("should send a verification email without a name", async () => {
      (transporter.sendMail as jest.Mock).mockResolvedValueOnce({});

      const to = "user@example.com";
      const token = "test-token";

      await sendVerificationEmail(to, token);

      expect(transporter.sendMail).toHaveBeenCalledTimes(1);
      const mailOptions = (transporter.sendMail as jest.Mock).mock.calls[0][0];

      expect(mailOptions.html).toContain("Olá, Usuário! 👋");
      expect(mailOptions.html).toContain("http://localhost:3000/verify-email?token=test-token");
    });

    it("should throw an error if email sending fails", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      (transporter.sendMail as jest.Mock).mockRejectedValueOnce(new Error("Mail error"));

      const to = "user@example.com";
      const token = "test-token";

      await expect(sendVerificationEmail(to, token)).rejects.toThrow(
        "Não foi possível enviar o email de verificação."
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao enviar email de verificação:",
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe("sendLoginAlertEmail", () => {
    it("should send a login alert email with correct details", async () => {
      (transporter.sendMail as jest.Mock).mockResolvedValueOnce({});

      const to = "user@example.com";
      const name = "Test User";
      const loginInfo = {
        timestamp: "2025-09-16 10:00:00",
        ip: "192.168.1.1",
        userAgent: "Test Browser",
        location: "Test City"
      };

      await sendLoginAlertEmail(to, name, loginInfo);

      expect(transporter.sendMail).toHaveBeenCalledTimes(1);
      const mailOptions = (transporter.sendMail as jest.Mock).mock.calls[0][0];

      expect(mailOptions.from).toBe("test@example.com");
      expect(mailOptions.to).toBe(to);
      expect(mailOptions.subject).toBe("🔔 Novo Login Detectado - DevTasks");
      expect(mailOptions.html).toContain("Olá, Test User! 👋");
      expect(mailOptions.html).toContain(
        'Data e Hora:</span>\n                            <span class="info-value">2025-09-16 10:00:00'
      );
      expect(mailOptions.html).toContain(
        'Endereço IP:</span>\n                            <span class="info-value">192.168.1.1'
      );
      expect(mailOptions.html).toContain(
        'Localização:</span>\n                            <span class="info-value">Test City'
      );
      expect(mailOptions.html).toContain(
        'Dispositivo:</span>\n                            <span class="info-value">Test Browser'
      );
    });

    it("should send a login alert email without optional info", async () => {
      (transporter.sendMail as jest.Mock).mockResolvedValueOnce({});

      const to = "user@example.com";
      const name = "Test User";
      const loginInfo = {
        timestamp: "2025-09-16 10:00:00"
      };

      await sendLoginAlertEmail(to, name, loginInfo);

      expect(transporter.sendMail).toHaveBeenCalledTimes(1);
      const mailOptions = (transporter.sendMail as jest.Mock).mock.calls[0][0];

      expect(mailOptions.html).toContain("Olá, Test User! 👋");
      expect(mailOptions.html).toContain(
        'Data e Hora:</span>\n                            <span class="info-value">2025-09-16 10:00:00'
      );
      expect(mailOptions.html).not.toContain("Endereço IP:");
      expect(mailOptions.html).not.toContain("Localização:");
      expect(mailOptions.html).not.toContain("Dispositivo:");
    });

    it("should throw an error if login alert email sending fails", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
      (transporter.sendMail as jest.Mock).mockRejectedValueOnce(new Error("Mail error"));

      const to = "user@example.com";
      const name = "Test User";
      const loginInfo = {
        timestamp: "2025-09-16 10:00:00"
      };

      await expect(sendLoginAlertEmail(to, name, loginInfo)).rejects.toThrow(
        "Não foi possível enviar o email de alerta de login."
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erro ao enviar email de alerta de login:",
        expect.any(Error)
      );
      consoleErrorSpy.mockRestore();
    });
  });
});
