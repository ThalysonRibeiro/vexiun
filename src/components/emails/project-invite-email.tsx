import { BRANDING } from "@/lib/constants/branding";
import { Button, Heading, Hr, Section, Text } from "@react-email/components";
import { EmailLayout } from "./shared/email-layout";

interface ProjectInviteEmailProps {
  projectName: string;
  projectDescription?: string;
  inviterName: string;
  role: string;
  acceptUrl: string;
}

export function ProjectInviteEmail({
  projectName,
  projectDescription,
  inviterName,
  role,
  acceptUrl
}: ProjectInviteEmailProps) {
  return (
    <EmailLayout preview={`Convite para o projeto "${projectName}" em ${BRANDING.name}`}> 
      <div style={content}>
        <Heading style={h1}>Você foi convidado para um projeto</Heading>

        <Text style={text}>
          <strong>{inviterName}</strong> convidou você para participar do projeto
          {" "}
          <strong>{projectName}</strong> com a permissão de <strong>{role}</strong>.
        </Text>

        {projectDescription ? (
          <Section style={box}>
            <Text style={boxTitle}>Prévia do projeto</Text>
            <Text style={boxText}>{projectDescription}</Text>
          </Section>
        ) : null}

        <Section>
          <div style={detailsBox}>
            <div style={infoLine}>
              <strong style={infoTitle}>Projeto:</strong>
              <span style={infoText}>{projectName}</span>
            </div>
            <div style={infoLine}>
              <strong style={infoTitle}>Convidado por:</strong>
              <span style={infoText}>{inviterName}</span>
            </div>
            <div style={infoLine}>
              <strong style={infoTitle}>Permissão:</strong>
              <span style={infoText}>{role}</span>
            </div>
          </div>
        </Section>

        <Section style={buttonContainer}>
          <Button style={button} href={acceptUrl}>
            Aceitar Convite
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={disclaimer}>
          Se você não esperava este convite, pode ignorar este email com segurança.
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
  marginTop: "12px"
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

const box = {
  backgroundColor: "#f3f4f6",
  borderRadius: "6px",
  padding: "16px",
  margin: "12px 0 20px"
};

const boxTitle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: 0,
  lineHeight: "1.5",
  fontWeight: 600 as const
};

const boxText = {
  fontSize: "14px",
  color: "#374151",
  margin: "8px 0 0 0",
  lineHeight: "1.6"
};

const detailsBox = {
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "16px"
};

const infoLine = {
  marginBottom: "8px"
};

const infoTitle = {
  color: "#0f172a",
  fontSize: "14px"
};

const infoText = {
  color: "#64748b",
  fontSize: "14px",
  marginLeft: "8px"
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "16px 0"
};

const disclaimer = {
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: "1.5",
  marginBottom: "8px"
};