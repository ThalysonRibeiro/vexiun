import { getMyPendingInvitations, getWorkspacePendingInvitations } from "@/app/data-access/user";
import { unwrapServerData } from "@/utils/server-helpers";
import { InvitesContent } from "./_components/invites-content";

export const dynamic = "force-dynamic";

export default async function Invites() {
  const pendingInvites = await getMyPendingInvitations().then(unwrapServerData);

  const sentInvites = await getWorkspacePendingInvitations().then(unwrapServerData);

  const commonProps = {
    pendingInvites,
    sentInvites
  };

  return <InvitesContent {...commonProps} />;
}
