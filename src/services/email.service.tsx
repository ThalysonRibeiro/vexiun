import { Resend } from "resend";
import { render } from "@react-email/render";
import VerificationEmail from "@/components/emails/verification";
import LoginAlertEmail from "@/components/emails/login-alert";
import { env } from "@/lib/env";

export async function sendVerificationEmail(to: string, token: string, name?: string) {
  const verifyUrl = `${env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;
  try {
    await sendEmail({
      to,
      subject: "Confirme seu email",
      html: await render(
        <VerificationEmail
          verifyUrl={verifyUrl}
          userName={name}
          //   logoUrl={`${process.env.NEXT_PUBLIC_APP_URL}/logo-goallist.png`}
        />
      )
    });
  } catch (error) {
    console.error("Erro ao enviar email de verificação:", error);
    throw new Error("Não foi possível enviar o email de verificação.");
  }
}

export interface LoginInfo {
  timestamp: string;
  ip: string;
  location: string;
  userAgent: string;
  provider?: string;
  isNewUser?: boolean;
}

export async function sendLoginAlertEmail(to: string, name: string, loginInfo: LoginInfo) {
  try {
    const emailHtml = await render(
      LoginAlertEmail({
        name,
        timestamp: loginInfo.timestamp,
        ip: loginInfo.ip,
        location: loginInfo.location,
        userAgent: loginInfo.userAgent,
        provider: loginInfo.provider,
        isNewUser: loginInfo.isNewUser
      })
    );

    await sendEmail({
      to,
      subject: "🔔 Novo Login Detectado na sua Conta",
      html: emailHtml
    });
  } catch (error) {
    console.error("Erro ao enviar email de alerta de login:", error);
    throw new Error("Não foi possível enviar o email de alerta de login.");
  }
}

const resend = new Resend(env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${env.RESEND_FROM_EMAIL}>`,
      to,
      subject,
      html
    });
    if (error) {
      console.error("Erro ao enviar email:", error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }
}

// await sendEmail({
//   to: user.email,
//   subject: 'Confirme seu email',
//   html: emailTemplate
// });
