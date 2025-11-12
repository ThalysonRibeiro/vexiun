import { LoginAlertEmail } from "@/components/emails/login-alert";
import { ResetPasswordTemplate } from "@/components/emails/password-reset-email";
import VerificationEmails from "@/components/emails/verification";
import { WelcomeEmail } from "@/components/emails/welcome-email";
import { ProjectInviteEmail } from "@/components/emails/project-invite-email";
import { TaskAssignedEmail } from "@/components/emails/task-assigned-email";
import { ProjectUpdatesDigest } from "@/components/emails/project-updates-digest";
import { AccountDeletedEmail } from "@/components/emails/account-deleted-email";
import { SubscriptionEmail } from "@/components/emails/subscription-email";

export default async function EmailPreview() {
  return (
    <main className="bg-zinc-950">
      {await (
        <LoginAlertEmail
          name="Usuário"
          timestamp="01/01/2024 às 10:00:00"
          ip="192.168.1.1"
          location="São Paulo, SP, Brasil"
          userAgent="Chrome/Windows"
          provider="credentials"
          isNewUser={true}
        />
      )}
      {/* {await (<VerificationEmails />)} */}
      {/* {await (<WelcomeEmail userName="Usuário" />)} */}
      {/* {await (
        <ResetPasswordTemplate
          resetUrl="https://vexiun.com/reset-password?token=xxx"
          userName="João"
        />
      )} */}

      {/* {await (
        <ProjectInviteEmail
          projectName="Plataforma Vexiun"
          projectDescription="Projeto para reimaginar gestão de projetos com IA."
          inviterName="Ana Líder"
          role="Member"
          acceptUrl="https://vexiun.com/invites/accept?token=abc"
        />
      )} */}

      {/* {await (
        <TaskAssignedEmail
          taskName="Implementar autenticação"
          projectName="Plataforma Vexiun"
          assignedBy="Carlos Tech Lead"
          deadline="20/11/2025"
          priority="high"
          taskUrl="https://vexiun.com/projects/1/tasks/42"
        />
      )} */}

      {/* {await (
        <ProjectUpdatesDigest
          projectName="Plataforma Vexiun"
          periodLabel="Últimos 7 dias"
          completedTasks={["Setup CI", "Teste de smoke", "Integração com Prisma"]}
          newTasks={["Feature de convites", "Template de emails", "Endpoints de assinatura"]}
          comments={[
            { author: "Maria", excerpt: "Revisar PR #120", date: "15/11/2025" },
            { author: "João", excerpt: "Ótima cobertura de testes!", date: "16/11/2025" }
          ]}
          updatesUrl="https://vexiun.com/projects/1/updates"
        />
      )} */}

      {/* {await (
        <AccountDeletedEmail
          userName="Usuário"
          permanentDeletionDate="20/11/2025"
          recoveryDays={7}
          recoverUrl="https://vexiun.com/recover"
        />
      )} */}

      {/* {await (
        <SubscriptionEmail
          type="upgrade"
          oldPlan="Starter"
          newPlan="Pro"
          amount="R$ 49,90"
          nextBillingDate="20/11/2025"
          billingUrl="https://vexiun.com/billing"
          manageUrl="https://vexiun.com/settings/billing"
        />
      )} */}
    </main>
  );
}
