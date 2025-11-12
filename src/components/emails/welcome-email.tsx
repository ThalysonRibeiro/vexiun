import { Button, Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "./shared/email-layout";
import { BRANDING } from "@/lib/constants/branding";

export function WelcomeEmail({ userName }: { userName: string }) {
  return (
    <EmailLayout preview={`Bem-vindo ao ${BRANDING.name}!`}>
      <div style={content}>
        <Heading style={h1}>Bem-vindo ao {BRANDING.name}!</Heading>

        <Text style={text}>Olá {userName}!</Text>

        <Text style={text}>
          Sua conta foi verificada com sucesso. Agora você pode começar a usar todas as
          funcionalidades da nossa plataforma.
        </Text>

        <Section style={buttonContainer}>
          <Button style={button} href={`${BRANDING.url}/dashboard`}>
            Acessar Dashboard
          </Button>
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
