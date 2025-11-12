import { BRANDING } from "@/lib/constants/branding";
import { Button, Heading, Hr, Section, Text } from "@react-email/components";
import { EmailLayout } from "./shared/email-layout";

interface AccountDeletedEmailProps {
  userName?: string;
  permanentDeletionDate: string; // ex: "20/11/2025"
  recoveryDays: number; // ex: 7
  recoverUrl: string;
}

export function AccountDeletedEmail({
  userName = "Usuário",
  permanentDeletionDate,
  recoveryDays,
  recoverUrl
}: AccountDeletedEmailProps) {
  return (
    <EmailLayout preview={`Confirmação de exclusão de conta - ${BRANDING.name}`}> 
      <div style={content}>
        <Heading style={h1}>Sua conta foi excluída</Heading>

        <Text style={text}>Olá {userName},</Text>
        <Text style={text}>
          Confirmamos a exclusão da sua conta na <strong>{BRANDING.name}</strong>. Entendemos que
          esta pode ser uma decisão difícil e queremos agradecer por ter feito parte da nossa
          comunidade.
        </Text>

        <Section style={box}>
          <Text style={boxTitle}>Remoção permanente dos dados</Text>
          <Text style={boxText}>
            Seus dados serão removidos permanentemente em <strong>{permanentDeletionDate}</strong>.
          </Text>
        </Section>

        <Section style={boxWarning}>
          <Text style={boxTitle}>Recuperar conta</Text>
          <Text style={boxText}>
            Você pode recuperar sua conta dentro de <strong>{recoveryDays} dias</strong> a partir
            desta confirmação. Após este período, a remoção será irreversível.
          </Text>
          <div style={buttonContainer}>
            <Button style={button} href={recoverUrl}>Recuperar Conta</Button>
          </div>
        </Section>

        <Hr style={hr} />

        <Text style={disclaimer}>
          Caso tenha qualquer dúvida, nossa equipe de suporte está disponível em
          {" "}
          <strong>{BRANDING.emails.support}</strong>.
        </Text>
        <Text style={farewell}>Desejamos o melhor em seus próximos projetos.</Text>
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

const box = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px"
};

const boxWarning = {
  backgroundColor: "#fef3c7",
  border: "1px solid #fbbf24",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "16px"
};

const boxTitle = {
  fontSize: "14px",
  color: "#1f2937",
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

const farewell = {
  fontSize: "14px",
  color: "#374151",
  marginTop: "4px"
};