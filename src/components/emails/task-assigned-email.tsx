import { BRANDING } from "@/lib/constants/branding";
import { Button, Heading, Hr, Section, Text } from "@react-email/components";
import { EmailLayout } from "./shared/email-layout";

type Priority = "low" | "medium" | "high";

interface TaskAssignedEmailProps {
  taskName: string;
  projectName: string;
  assignedBy: string;
  deadline?: string; // Formato livre, ex: "2025-11-20" ou "20/11/2025"
  priority?: Priority;
  taskUrl: string;
}

export function TaskAssignedEmail({
  taskName,
  projectName,
  assignedBy,
  deadline,
  priority = "medium",
  taskUrl
}: TaskAssignedEmailProps) {
  const previewText = `Nova tarefa atribuída: ${taskName}`;

  return (
    <EmailLayout preview={previewText}>
      <div style={content}>
        <Heading style={h1}>Você recebeu uma nova tarefa</Heading>

        <Text style={text}>
          <strong>{assignedBy}</strong> atribuiu a tarefa <strong>{taskName}</strong> no projeto
          {" "}
          <strong>{projectName}</strong>.
        </Text>

        <Section>
          <div style={detailsBox}>
            <div style={infoLine}>
              <strong style={infoTitle}>Tarefa:</strong>
              <span style={infoText}>{taskName}</span>
            </div>
            <div style={infoLine}>
              <strong style={infoTitle}>Projeto:</strong>
              <span style={infoText}>{projectName}</span>
            </div>
            <div style={infoLine}>
              <strong style={infoTitle}>Atribuída por:</strong>
              <span style={infoText}>{assignedBy}</span>
            </div>
            {deadline ? (
              <div style={infoLine}>
                <strong style={infoTitle}>Prazo:</strong>
                <span style={infoText}>{deadline}</span>
              </div>
            ) : null}
            <div style={infoLine}>
              <strong style={infoTitle}>Prioridade:</strong>
              <span style={{ ...priorityBadge, ...priorityColor(priority) }}>{priority}</span>
            </div>
          </div>
        </Section>

        <Section style={buttonContainer}>
          <Button style={button} href={taskUrl}>
            Ver Task
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={disclaimer}>
          Dica: mantenha seu foco com notificações inteligentes da {BRANDING.name}.
        </Text>
      </div>
    </EmailLayout>
  );
}

function priorityColor(p: Priority) {
  switch (p) {
    case "low":
      return { backgroundColor: "#e5e7eb", color: "#374151" };
    case "medium":
      return { backgroundColor: "#fde68a", color: "#92400e" };
    case "high":
      return { backgroundColor: "#fecaca", color: "#7f1d1d" };
    default:
      return { backgroundColor: "#e5e7eb", color: "#374151" };
  }
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

const priorityBadge = {
  display: "inline-block",
  padding: "2px 8px",
  borderRadius: "999px",
  fontSize: "12px",
  textTransform: "capitalize" as const,
  marginLeft: "8px"
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