import getSession from "@/lib/getSession";
import { redirect } from "next/navigation";
import { WorkspaceContent } from "./_components/workspace-content";
import { getGroups } from "@/app/data-access/groupe";
import { getPriorities, getStatus } from "@/app/data-access/item";
import { getTeam } from "@/app/data-access/team";
import { unwrapServerData } from "@/utils/server-helpers";


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
  const groupsData = await getGroups(workspaceId).then(unwrapServerData);
  const prioritiesData = await getPriorities(workspaceId).then(unwrapServerData);
  const statusData = await getStatus(workspaceId).then(unwrapServerData);

  return (
    <main className="container mx-auto px-6 pt-6">
      <WorkspaceContent
        groupsData={groupsData}
        workspaceId={workspaceId}
        prioritiesData={prioritiesData}
        statusData={statusData}
      />
    </main>
  )
}