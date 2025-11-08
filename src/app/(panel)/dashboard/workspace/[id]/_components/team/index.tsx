"use client";
import { HeaderTeam } from "./header";
import { ListMembers } from "./list-members";
import { ConfirmChangeCriticalRole } from "./confirm-change-critical";
import { useActionTeamWorkspace } from "@/hooks/use-team";

export function Team({ workspaceId }: { workspaceId: string }) {
  const {
    selectedUsers,
    setSelectedUsers,
    loading,
    setLoading,
    confirmDialog,
    setConfirmDialog,
    userSearchRef,
    team,
    addWorkspaceMember,
    updateRoleMember,
    removeMember,
    executeRoleChange,
    existingMemberIds,
    handleRemoveMember,
    handleRoleChange,
    onSubmit,
    router
  } = useActionTeamWorkspace(workspaceId);

  const commomProps = {
    workspaceId,
    selectedUsers,
    onSelectedUsers: setSelectedUsers,
    loading,
    setLoading,
    confirmDialog,
    onConfirmDialog: setConfirmDialog,
    userSearchRef,
    team,
    addWorkspaceMember,
    updateRoleMember,
    removeMember,
    executeRoleChange,
    existingMemberIds,
    onRemoveMember: handleRemoveMember,
    onRoleChange: handleRoleChange,
    onSubmit,
    onRedirect: router.push
  };

  return (
    <section className="mt-6 space-y-4 flex flex-col">
      <HeaderTeam {...commomProps} />

      {team?.length === 0 ? <p>Nenhum membro no time</p> : <ListMembers {...commomProps} />}

      <ConfirmChangeCriticalRole {...commomProps} />
    </section>
  );
}
