import { branding } from "@/lib/constants";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text
} from "@react-email/components";

interface VerifyEmailProps {
  verifyUrl?: string;
  userName?: string;
  logoUrl?: string;
}

export default function VerificationEmails({
  verifyUrl,
  userName = "Usuário",
  logoUrl = "https://res.cloudinary.com/duxqtpghn/image/upload/v1762484341/logo-catalyst_npljyy.png"
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verifique seu email para começar a usar o {branding.name}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={logoSection}>
            <Img src={logoUrl} alt={branding.name} width="80" height="80" style={logo} />
          </Section>

          {/* Conteúdo Principal */}
          <Heading style={h1}>Verifique seu email</Heading>

          <Text style={text}>Olá{userName ? ` ${userName}` : ""}! 👋</Text>

          <Text style={text}>
            Obrigado por se cadastrar no <strong>{branding.name}</strong>. Para começar a usar nossa
            plataforma de gerenciamento de projetos com IA, precisamos verificar seu endereço de
            email.
          </Text>

          <Text style={text}>Clique no botão abaixo para verificar sua conta:</Text>

          {/* Botão CTA */}
          <Section style={buttonContainer}>
            <Button style={button} href={verifyUrl}>
              Verificar Email
            </Button>
          </Section>

          {/* Link alternativo */}
          <Section style={codeBox}>
            <Text style={codeLabel}>Ou copie e cole este link no seu navegador:</Text>
            <Text style={codeText}>{verifyUrl}</Text>
          </Section>

          <Text style={disclaimer}>
            Se você não criou uma conta no Catalyst PM, pode ignorar este email com segurança.
          </Text>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              <strong>Catalyst PM</strong> - The AI-powered project manager that reads your code
            </Text>

            <Text style={footerLinks}>
              <Link href="https://catalystpm.app" style={link}>
                catalystpm.app
              </Link>
              {" · "}
              <Link href="mailto:support@catalystpm.app" style={link}>
                support@catalystpm.app
              </Link>
            </Text>

            <Text style={socialLinks}>
              <Link href="https://twitter.com/catalystpm" style={socialLink}>
                Twitter
              </Link>
              {" · "}
              <Link href="https://linkedin.com/company/catalystpm" style={socialLink}>
                LinkedIn
              </Link>
              {" · "}
              <Link href="https://github.com/catalystpm" style={socialLink}>
                GitHub
              </Link>
            </Text>
          </Section>

          <Text style={copyright}>© 2025 Catalyst PM. Todos os direitos reservados.</Text>
        </Container>
      </Body>
    </Html>
  );
}

// Estilos
const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: "40px 20px"
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  padding: "40px",
  margin: "0 auto",
  maxWidth: "600px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
};

const logoSection = {
  marginBottom: "32px"
};

const logo = {
  display: "block",
  margin: "0"
};

const h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1f2937",
  marginBottom: "16px",
  marginTop: 0
};

const text = {
  fontSize: "16px",
  color: "#4b5563",
  lineHeight: "1.5",
  marginBottom: "24px"
};

const buttonContainer = {
  textAlign: "center" as const,
  marginBottom: "32px"
};

const button = {
  backgroundColor: "#3b82f6",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "12px 32px",
  borderRadius: "6px",
  display: "inline-block"
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

const hr = {
  borderColor: "#e5e7eb",
  margin: "32px 0"
};

const footer = {
  textAlign: "center" as const
};

const footerText = {
  fontSize: "14px",
  color: "#9ca3af",
  marginBottom: "8px"
};

const footerLinks = {
  fontSize: "12px",
  color: "#9ca3af",
  marginBottom: "16px"
};

const socialLinks = {
  fontSize: "12px",
  color: "#9ca3af"
};

const link = {
  color: "#3b82f6",
  textDecoration: "none"
};

const socialLink = {
  color: "#9ca3af",
  textDecoration: "none"
};

const copyright = {
  textAlign: "center" as const,
  fontSize: "12px",
  color: "#9ca3af",
  marginTop: "24px"
};
