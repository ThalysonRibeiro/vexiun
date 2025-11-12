import { Link, Section, Text, Hr, Button } from "@react-email/components";
import { EmailLayout } from "./shared/email-layout";
import { BRANDING } from "@/lib/constants/branding";

interface LoginAlertEmailProps {
  name: string;
  timestamp: string;
  ip: string;
  location: string;
  userAgent: string;
  provider?: string;
  isNewUser?: boolean;
}

export function LoginAlertEmail({
  name = "Usuário",
  timestamp = "01/01/2024 às 10:00:00",
  ip = "192.168.1.1",
  location = "São Paulo, SP, Brasil",
  userAgent = "Chrome/Windows",
  provider = "credentials",
  isNewUser = false
}: LoginAlertEmailProps) {
  const previewText = isNewUser
    ? `Bem-vindo ao Vexiun!`
    : `Novo login detectado na sua conta Vexiun`;

  return (
    <EmailLayout preview={`Bem-vindo ao ${BRANDING.name}!`}>
      <div style={content}>
        {/* Mensagem principal */}
        <h1 style={h1}>Novo login detectado na sua conta Vexiun</h1>
        <Text style={text}>
          Olá <strong>{name}</strong>,
        </Text>

        <Text style={text}>
          Detectamos um novo acesso na sua conta. Se foi você, pode ignorar este email.
        </Text>

        {/* Informações do login */}
        <Section>
          <Text style={infoTitle}>📋 Detalhes do Acesso</Text>

          <Hr style={hr} />

          <div
            style={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              padding: "20px",
              marginBottom: "24px"
            }}
          >
            <div style={infoLine}>
              <strong style={infoLineTitle}>Dispositivo:</strong>
              <span style={infoLineText}>{userAgent}</span>
            </div>
            <div style={infoLine}>
              <strong style={infoLineTitle}>Localização:</strong>
              <span style={infoLineText}>{location}</span>
            </div>
            <div style={infoLine}>
              <strong style={infoLineTitle}>IP:</strong>
              <span style={infoLineText}>{ip}</span>
            </div>
            <div>
              <strong style={infoLineTitle}>Horário:</strong>
              <span style={infoLineText}>{timestamp}</span>
            </div>
          </div>

          <Text style={text}>Se foi você, pode ignorar este email.</Text>

          <Text style={textDestructive}>
            Se não foi você, recomendamos alterar sua senha imediatamente.
          </Text>
        </Section>

        {/* Alerta de segurança */}
        <Section style={warningBox}>
          <Text style={warningText}>
            ⚠️ <strong>Não foi você?</strong>
          </Text>
          <Text style={warningText}>
            Se você não reconhece este acesso, recomendamos que altere sua senha imediatamente e
            verifique suas configurações de segurança.
          </Text>
          <div style={buttonContainer}>
            <Link href="https://seu-dominio.com/settings/security" style={button}>
              Alterar Senha
            </Link>
          </div>
        </Section>
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

const textDestructive = {
  fontSize: "16px",
  color: "#dc2626",
  lineHeight: "1.6",
  margin: "0 0 16px",
  fontWeight: "500"
};

const infoTitle = {
  color: "#1f2937",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px 0"
};

const infoLine = {
  marginBottom: "10px"
};

const infoLineTitle = {
  color: "#0f172a",
  fontSize: "14px"
};
const infoLineText = {
  color: "#64748b",
  fontSize: "14px",
  marginLeft: "8px"
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "16px 0"
};

const warningBox = {
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  padding: "24px",
  border: "1px solid #fbbf24"
};

const warningText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "8px 0"
};
