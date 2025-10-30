import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { WorkspaceContent } from "./_components/workspace-content";

export const revalidate = 120;

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getSession();
  if (!session) {
    redirect('/')
  }
  const workspaceId = (await params).id;
  return (
    <main className="container mx-auto px-6 pt-6">
      <WorkspaceContent
        workspaceId={workspaceId}
      />
    </main>
  );
}