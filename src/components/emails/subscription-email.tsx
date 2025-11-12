import { BRANDING } from "@/lib/constants/branding";
import { Button, Heading, Hr, Section, Text } from "@react-email/components";
import { EmailLayout } from "./shared/email-layout";

type SubscriptionType = "upgrade" | "downgrade" | "cancelamento" | "renovação";

interface SubscriptionEmailProps {
  type: SubscriptionType;
  oldPlan?: string;
  newPlan?: string;
  amount?: string; // ex: "R$ 49,90"
  nextBillingDate?: string; // ex: "20/11/2025"
  billingUrl?: string;
  manageUrl?: string;
}

export function SubscriptionEmail({
  type,
  oldPlan,
  newPlan,
  amount,
  nextBillingDate,
  billingUrl = `${BRANDING.url}/billing`,
  manageUrl = `${BRANDING.url}/settings/billing`
}: SubscriptionEmailProps) {
  const previewText = `Assinatura: ${type}`;
  const isChange = type === "upgrade" || type === "downgrade";
  const showBilling = type === "renovação" || type === "upgrade" || type === "downgrade";

  return (
    <EmailLayout preview={previewText}>
      <div style={content}>
        <Heading style={h1}>Atualização da sua assinatura</Heading>

        <Text style={text}>
          Tipo: <strong style={{ textTransform: "capitalize" as const }}>{type}</strong>
        </Text>

        {isChange && (
          <Section style={compareBox}>
            <Text style={sectionTitle}>Plano</Text>
            <div style={compareRow}>
              <div style={compareCol}>
                <Text style={compareLabel}>Anterior</Text>
                <Text style={compareValue}>{oldPlan || "—"}</Text>
              </div>
              <div style={compareCol}>
                <Text style={compareLabel}>Novo</Text>
                <Text style={compareValue}>{newPlan || "—"}</Text>
              </div>
            </div>
          </Section>
        )}

        <Section style={box}>
          <Text style={sectionTitle}>Cobrança</Text>
          <div style={infoLine}>
            <strong style={infoTitle}>Valor:</strong>
            <span style={infoText}>{amount || "—"}</span>
          </div>
          <div style={infoLine}>
            <strong style={infoTitle}>Próxima cobrança:</strong>
            <span style={infoText}>{nextBillingDate || "—"}</span>
          </div>
        </Section>

        <Section style={buttonRow}>
          {showBilling && (
            <Button style={buttonPrimary} href={billingUrl}>
              Ver Cobrança
            </Button>
          )}
          <Button style={buttonSecondary} href={manageUrl}>
            Gerenciar Assinatura
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={disclaimer}>
          Se você não reconhece esta alteração, entre em contato com nosso suporte:
          {" "}
          <strong>{BRANDING.emails.support}</strong>.
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

const sectionTitle = {
  fontSize: "16px",
  fontWeight: 600,
  color: "#1f2937",
  margin: "0 0 8px 0"
};

const box = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px"
};

const compareBox = {
  backgroundColor: "#f3f4f6",
  borderRadius: "6px",
  padding: "16px",
  marginBottom: "16px"
};

const compareRow = {
  display: "flex",
  gap: "16px"
};

const compareCol = {
  flex: 1
};

const compareLabel = {
  fontSize: "12px",
  color: "#6b7280",
  margin: 0
};

const compareValue = {
  fontSize: "14px",
  color: "#374151",
  margin: "4px 0 0"
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

const buttonRow = {
  textAlign: "center" as const
};

const buttonPrimary = {
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "#0f172a",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "16px",
  margin: "10px"
};

const buttonSecondary = {
  display: "inline-block",
  padding: "12px 24px",
  backgroundColor: "#111827",
  color: "#ffffff",
  textDecoration: "none",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "16px",
  margin: "10px"
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