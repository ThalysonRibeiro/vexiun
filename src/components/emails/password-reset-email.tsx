import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./shared/email-layout";

export function ResetPasswordTemplate({
  resetUrl = "https://vexiun.com/reset-password?token=xxx",
  userName = "João"
}: {
  resetUrl: string;
  userName: string;
}) {
  return (
    <EmailLayout preview="Redefinir senha">
      <div style={content}>
        <h1 style={h1}>Redefinir senha</h1>
        <Text style={text}>Olá {userName},</Text>
        <Text style={text}>
          Recebemos uma solicitação para redefinir a senha da sua conta Vexiun.
        </Text>
        <Text style={text}>Clique no botão abaixo para criar uma nova senha:</Text>

        <Section style={buttonContainer}>
          <Button style={button} href={resetUrl}>
            Redefinir Senha
          </Button>
        </Section>

        <Section style={warningBox}>
          <Text style={warningText}>
            ⚠️ <strong>Importante:</strong> Este link expira em 1 hora por segurança.
          </Text>
        </Section>

        <p
          style={{
            fontSize: "14px",
            color: "#64748b",
            lineHeight: "1.6",
            margin: "24px 0 0"
          }}
        >
          Se você não solicitou a redefinição de senha, ignore este email. Sua senha permanecerá
          inalterada.
        </p>
      </div>
    </EmailLayout>
  );
}

const content = {
  padding: "40px 40px 10px 40px"
};

const h1 = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#0f172a",
  marginTop: "0",
  marginBottom: "16px"
};

const buttonContainer = {
  textAlign: "center" as const
};

const button = {
  display: "inline-block",
  padding: "12px 32px",
  backgroundColor: "#0f172a",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "16px",
  margin: "20px 0"
};

const text = {
  fontSize: "16px",
  color: "#475569",
  lineHeight: "1.6",
  margin: "0 0 16px"
};

const warningBox = {
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  padding: "14px",
  border: "1px solid #fbbf24"
};

const warningText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "8px 0"
};
