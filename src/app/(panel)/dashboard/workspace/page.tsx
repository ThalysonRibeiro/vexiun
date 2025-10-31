import { getMyWorkspaces } from "@/app/data-access/workspace";
import { unwrapServerData } from "@/utils/server-helpers";
import { WorkspacesPageClient } from "./_components/workspaces-page-client";
import { getSharedWorkspaces } from "@/app/data-access/workspace/get-shared-workspaces";

export const dynamic = "force-dynamic";

export default async function WorkspacesPage() {
  const workspaces = await getMyWorkspaces().then(unwrapServerData);
  const sharedWorkspaces = await getSharedWorkspaces().then(unwrapServerData);

  return <WorkspacesPageClient workspaces={workspaces} sharedWorkspaces={sharedWorkspaces} />;
}
