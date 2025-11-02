import { getMyPendingInvitations, getWorkspacePendingInvitations } from "@/app/data-access/user";
import { unwrapServerData } from "@/utils/server-helpers";
import { InvitesContent } from "./_components/invites-content";

export default async function Invites() {
  const pendingInvitations = await getMyPendingInvitations().then(unwrapServerData);

  const sentInvitations = await getWorkspacePendingInvitations().then(unwrapServerData);

  return <InvitesContent pendingInvites={pendingInvitations} sentInvites={sentInvitations} />;
}
