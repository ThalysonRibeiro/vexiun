import { BRANDING } from "@/lib/constants/branding";
import { Button, Heading, Hr, Section, Text } from "@react-email/components";
import { EmailLayout } from "./shared/email-layout";

interface ProjectUpdatesDigestProps {
  projectName: string;
  periodLabel?: string; // ex: "Últimos 7 dias"
  completedTasks?: string[];
  newTasks?: string[];
  comments?: { author: string; excerpt: string; date?: string }[];
  updatesUrl: string;
}

export function ProjectUpdatesDigest({
  projectName,
  periodLabel = "Últimos 7 dias",
  completedTasks = [],
  newTasks = [],
  comments = [],
  updatesUrl
}: ProjectUpdatesDigestProps) {
  const previewText = `Atualizações de ${projectName} — ${periodLabel}`;
  const stats = [
    { label: "Completadas", value: completedTasks.length },
    { label: "Novas", value: newTasks.length },
    { label: "Comentários", value: comments.length }
  ];

  return (
    <EmailLayout preview={previewText}>
      <div style={content}>
        <Heading style={h1}>Resumo de atividades do projeto</Heading>

        <Text style={text}>
          Projeto: <strong>{projectName}</strong> · Período: <strong>{periodLabel}</strong>
        </Text>

        <Section style={statsContainer}>
          <table style={table} cellPadding={0} cellSpacing={0} role="presentation">
            <thead>
              <tr>
                {stats.map((s) => (
                  <th key={s.label} style={th}>
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {stats.map((s) => (
                  <td key={s.label} style={td}>
                    {s.value}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Section>

        {completedTasks.length > 0 && (
          <Section>
            <Text style={sectionTitle}>✅ Tasks completadas</Text>
            <ul style={ul}>
              {completedTasks.map((t, i) => (
                <li key={i} style={li}>{t}</li>
              ))}
            </ul>
          </Section>
        )}

        {newTasks.length > 0 && (
          <Section>
            <Text style={sectionTitle}>🆕 Novas tasks</Text>
            <ul style={ul}>
              {newTasks.map((t, i) => (
                <li key={i} style={li}>{t}</li>
              ))}
            </ul>
          </Section>
        )}

        {comments.length > 0 && (
          <Section>
            <Text style={sectionTitle}>💬 Comentários</Text>
            <div style={commentsBox}>
              {comments.map((c, i) => (
                <div key={i} style={commentItem}>
                  <strong style={commentAuthor}>{c.author}</strong>
                  <Text style={commentText}>{c.excerpt}</Text>
                  {c.date ? <Text style={commentDate}>{c.date}</Text> : null}
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section style={buttonContainer}>
          <Button style={button} href={updatesUrl}>
            Ver Todas Atualizações
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={disclaimer}>
          Este é um resumo automático da {BRANDING.name}. Ajuste suas preferências de notificação no
          painel.
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

const statsContainer = {
  margin: "8px 0 24px"
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
  border: "1px solid #e5e7eb",
  borderRadius: "6px"
};

const th = {
  textAlign: "left" as const,
  padding: "10px",
  fontSize: "14px",
  color: "#374151",
  borderBottom: "1px solid #e5e7eb"
};

const td = {
  padding: "12px",
  fontSize: "16px",
  color: "#0f172a"
};

const sectionTitle = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#1f2937",
  margin: "0 0 8px 0"
};

const ul = {
  margin: 0,
  paddingLeft: "18px"
};

const li = {
  fontSize: "14px",
  color: "#374151",
  marginBottom: "6px"
};

const commentsBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "12px"
};

const commentItem = {
  marginBottom: "12px"
};

const commentAuthor = {
  fontSize: "14px",
  color: "#0f172a"
};

const commentText = {
  fontSize: "14px",
  color: "#374151",
  margin: "4px 0"
};

const commentDate = {
  fontSize: "12px",
  color: "#6b7280"
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