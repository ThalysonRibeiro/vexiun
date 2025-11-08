import { branding } from "@/lib/constants";
import { transporter } from "@/lib/mailer";
import { Resend } from "resend";
import { render } from "@react-email/render";
import VerificationEmail from "@/components/emails/verification";

export async function sendVerificationEmail(to: string, token: string, name?: string) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_URL}/verify-email?token=${token}`;
  try {
    await sendEmail({
      to,
      subject: "Confirme seu email",
      html: await render(
        <VerificationEmail
          verifyUrl={verifyUrl}
          userName={name}
          //   logoUrl={`${process.env.NEXT_PUBLIC_URL}/logo-goallist.png`}
        />
      )
    });
  } catch (error) {
    console.error("Erro ao enviar email de verificação:", error);
    throw new Error("Não foi possível enviar o email de verificação.");
  }
}

export async function sendLoginAlertEmail(
  to: string,
  name?: string,
  loginInfo?: {
    timestamp: string;
    ip?: string;
    userAgent?: string;
    location?: string;
  }
) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to,
      subject: "🔔 Novo Login Detectado - DevTasks",
      html: /*html*/ `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Alerta de Login - DevTasks</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #f8f9fa;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px 30px;
                    text-align: center;
                    color: white;
                }
                .header h1 {
                    font-size: 28px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                .header p {
                    font-size: 16px;
                    opacity: 0.9;
                }
                .content {
                    padding: 40px 30px;
                }
                .greeting {
                    font-size: 18px;
                    font-weight: 500;
                    margin-bottom: 24px;
                    color: #2d3748;
                }
                .message {
                    font-size: 16px;
                    color: #4a5568;
                    margin-bottom: 32px;
                    line-height: 1.7;
                }
                .login-info {
                    background-color: #f7fafc;
                    padding: 24px;
                    border-radius: 8px;
                    margin: 24px 0;
                    border-left: 4px solid #667eea;
                }
                .login-info h3 {
                    color: #2d3748;
                    margin-bottom: 16px;
                    font-size: 18px;
                }
                .info-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 12px;
                    padding: 8px 0;
                    border-bottom: 1px solid #e2e8f0;
                }
                .info-item:last-child {
                    border-bottom: none;
                }
                .info-label {
                    font-weight: 600;
                    color: #4a5568;
                }
                .info-value {
                    color: #2d3748;
                    text-align: right;
                }
                .security-note {
                    background-color: #fff5f5;
                    border: 1px solid #fed7d7;
                    color: #c53030;
                    padding: 16px;
                    border-radius: 8px;
                    margin-top: 24px;
                    font-size: 14px;
                }
                .security-note strong {
                    display: block;
                    margin-bottom: 8px;
                }
                .footer {
                    background-color: #f7fafc;
                    padding: 30px;
                    text-align: center;
                    border-top: 1px solid #e2e8f0;
                }
                .footer p {
                    font-size: 14px;
                    color: #718096;
                    margin-bottom: 8px;
                }
                .brand {
                    font-weight: 600;
                    color: #667eea;
                }
                .action-button {
                    display: inline-block;
                    padding: 12px 24px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                    margin-top: 16px;
                }
                .action-button:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
                }
                @media (max-width: 600px) {
                    .email-container {
                        margin: 0;
                        border-radius: 0;
                    }
                    .header, .content, .footer {
                        padding: 20px;
                    }
                    .header h1 {
                        font-size: 24px;
                    }
                    .info-item {
                        flex-direction: column;
                        text-align: left;
                    }
                    .info-value {
                        text-align: left;
                        margin-top: 4px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>DevTasks</h1>
                    <p>🔔 Alerta de Segurança</p>
                </div>
                
                <div class="content">
                    <div class="greeting">
                        Olá, ${name || "Usuário"}! 👋
                    </div>
                    
                    <div class="message">
                        Detectamos um novo login na sua conta do <strong>DevTasks</strong>. Se foi você, pode ignorar este email. Caso contrário, recomendamos que você altere sua senha imediatamente.
                    </div>
                    
                    <div class="login-info">
                        <h3>📊 Detalhes do Login</h3>
                        <div class="info-item">
                            <span class="info-label">Data e Hora:</span>
                            <span class="info-value">${loginInfo?.timestamp || "Não disponível"}</span>
                        </div>
                        ${
                          loginInfo?.ip
                            ? `
                        <div class="info-item">
                            <span class="info-label">Endereço IP:</span>
                            <span class="info-value">${loginInfo.ip}</span>
                        </div>
                        `
                            : ""
                        }
                        ${
                          loginInfo?.location
                            ? `
                        <div class="info-item">
                            <span class="info-label">Localização:</span>
                            <span class="info-value">${loginInfo.location}</span>
                        </div>
                        `
                            : ""
                        }
                        ${
                          loginInfo?.userAgent
                            ? `
                        <div class="info-item">
                            <span class="info-label">Dispositivo:</span>
                            <span class="info-value">${loginInfo.userAgent}</span>
                        </div>
                        `
                            : ""
                        }
                    </div>
                    
                    <div class="security-note">
                        <strong>🔒 Dicas de Segurança</strong>
                        <ul style="margin-top: 8px; padding-left: 20px;">
                            <li>Nunca compartilhe suas credenciais de login</li>
                            <li>Use senhas fortes e únicas</li>
                            <li>Ative a autenticação de dois fatores quando disponível</li>
                            <li>Mantenha seus dispositivos atualizados</li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer">
                    <p>Se você não reconhece este login, entre em contato conosco imediatamente.</p>
                    <p>Atenciosamente,</p>
                    <p class="brand">Equipe DevTasks</p>
                </div>
            </div>
        </body>
        </html>
      `
    });
  } catch (error) {
    console.error("Erro ao enviar email de alerta de login:", error);
    throw new Error("Não foi possível enviar o email de alerta de login.");
  }
}

const resend = new Resend(process.env.RESEND_API_KEY);

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
    // await transporter.sendMail({
    //   from: `${branding.fullName} <${process.env.MAIL_USER}>`,
    //   to,
    //   subject,
    //   html
    // });
    const { data, error } = await resend.emails.send({
      from: `${branding.name} <${branding.email}>`,
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
