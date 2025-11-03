import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { WorkspaceContent } from "./_components/workspace-content";
import { validateWorkspaceAccess } from "@/lib/db/validators";
import { PermissionError } from "@/lib/errors";

export default async function WorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const workspaceId = (await params).id;

  try {
    await validateWorkspaceAccess(workspaceId, session.user.id as string);
  } catch (error) {
    // Redireciona silenciosamente com mensagem na URL
    if (error instanceof PermissionError) {
      redirect("/dashboard?error=workspace-access");
    }

    // Outros erros também redirecionam
    redirect("/dashboard?error=workspace-error");
  }

  return (
    <main className="container mx-auto px-6 pt-6">
      <WorkspaceContent workspaceId={workspaceId} />
    </main>
  );
}
