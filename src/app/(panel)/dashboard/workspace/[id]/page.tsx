import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { getGroups } from "./_data-access/get-groups";
import { WorkspaceContent } from "./_components/workspace-content";
import { getPriorities } from "./_data-access/get-priorities";
import { getStatus } from "./_data-access/get-status";
import { getTeam } from "./_data-access/get-team";


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
  const groupsData = await getGroups(workspaceId);
  const team = await getTeam({ workspaceId: workspaceId });
  const prioritiesData = await getPriorities(workspaceId);
  const statusData = await getStatus(workspaceId);

  return (
    <main className="container mx-auto px-6 pt-6">
      <WorkspaceContent
        groupsData={groupsData}
        workspaceId={workspaceId}
        prioritiesData={prioritiesData}
        statusData={statusData}
        team={team}
      />
    </main>
  )
}