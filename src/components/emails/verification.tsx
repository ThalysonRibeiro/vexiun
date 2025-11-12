import { BRANDING } from "@/lib/constants/branding";
import { Button, Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "./shared/email-layout";

interface VerifyEmailProps {
  verifyUrl?: string;
  userName?: string;
}

export default function VerificationEmail({ verifyUrl, userName = "Usuário" }: VerifyEmailProps) {
  return (
    <EmailLayout preview={`Verifique seu email para começar a usar o ${BRANDING.name}`}>
      <div style={content}>
        <Heading style={h1}>Verifique seu email</Heading>

        <Text style={text}>Olá{userName ? ` ${userName}` : ""}!</Text>

        <Text style={text}>
          Bem-vindo a <strong>{BRANDING.name}</strong>. Para começar a usar nossa plataforma de
          gerenciamento de projetos com IA, precisamos verificar seu endereço de email.
        </Text>

        <Text style={text}>Clique no botão abaixo para verificar sua conta:</Text>

        <Section style={buttonContainer}>
          <Button style={button} href={verifyUrl}>
            Verificar Email
          </Button>
        </Section>

        <Section style={codeBox}>
          <Text style={codeLabel}>Ou copie e cole este link no seu navegador:</Text>
          <Text style={codeText}>{verifyUrl}</Text>
        </Section>

        <Text style={disclaimer}>
          Se você não criou uma conta na {BRANDING.name}, pode ignorar este email com segurança.
        </Text>
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

const text = {
  fontSize: "16px",
  color: "#475569",
  lineHeight: "1.6",
  margin: "0 0 16px"
};

const buttonContainer = {
  textAlign: "center" as const,
  marginBottom: "32px"
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

const codeBox = {
  backgroundColor: "#f3f4f6",
  borderRadius: "6px",
  padding: "16px",
  marginBottom: "32px"
};

const codeLabel = {
  fontSize: "14px",
  color: "#6b7280",
  margin: 0,
  lineHeight: "1.5"
};

const codeText = {
  fontSize: "14px",
  color: "#3b82f6",
  margin: "8px 0 0 0",
  wordBreak: "break-all" as const
};

const disclaimer = {
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: "1.5",
  marginBottom: "24px"
};
