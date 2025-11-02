"use client";

import { useActionWorkspaceInvites } from "@/hooks/use-workspace";
import { Separator } from "@/components/ui/separator";
import { InvitesWithWorkspaceAndInviter, SentInvite } from "./types";
import { PendingInvites } from "./pending-invites";
import { SentInvites } from "./sent-invites";

interface InvitesContentProps {
  pendingInvites: InvitesWithWorkspaceAndInviter[];
  sentInvites?: SentInvite[] | null;
}

export function InvitesContent(props: InvitesContentProps) {
  const { pendingInvites, sentInvites } = props;
  const {
    loadingMap,
    selected,
    toggleSelect,
    clearSelected,
    selectAllInGroup,
    unselectAllInGroup,
    handleAccept,
    handleDecline,
    handleCancel
  } = useActionWorkspaceInvites();

  const commonProps = {
    loadingMap,
    selected,
    toggleSelect,
    clearSelected,
    selectAllInGroup,
    unselectAllInGroup,
    onAccept: handleAccept,
    onDecline: handleDecline,
    onCancel: handleCancel
  };

  return (
    <main className="px-10 py-10 space-y-6">
      <PendingInvites {...commonProps} pendingInvites={pendingInvites} />

      <Separator />

      <SentInvites {...commonProps} sentInvites={sentInvites} />
    </main>
  );
}
