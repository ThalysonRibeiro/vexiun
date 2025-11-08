import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api/fetch-api";
import { WorkspaceRole } from "@/generated/prisma";
import { useCallback, useRef, useState } from "react";
import { UserSearchType } from "@/app/(panel)/dashboard/_components/utility-action-dashboard/create-workspace";
import { UserSearchRef } from "@/components/user-search";
import { useAddWorkspaceMember, useRemoveMember, useUpdateRoleMember } from "./use-workspace";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { isSuccessResponse } from "@/lib/errors";
import { badges } from "@/components/badge-workspace";

export type TeamResponse = {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  role: WorkspaceRole;
}[];

export function useTeam(workspaceId: string) {
  return useQuery<TeamResponse>({
    queryKey: ["team", workspaceId] as const,
    queryFn: async () => {
      return fetchAPI(`/api/workspace/${workspaceId}/team`);
    },
    enabled: !!workspaceId
  });
}

export function useTeamCount(workspaceId: string) {
  return useQuery<number | undefined>({
    queryKey: ["team", "team-count", workspaceId] as const,
    queryFn: async () => {
      return fetchAPI(`/api/workspace/${workspaceId}/team/counts`);
    },
    enabled: !!workspaceId
  });
}

export function useInvalidateTeam() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["team"] });
  };
}

export function useActionTeamWorkspace(workspaceId: string) {
  const [selectedUsers, setSelectedUsers] = useState<UserSearchType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    memberId: string;
    newRole: WorkspaceRole;
    currentRole: WorkspaceRole;
  } | null>(null);
  const userSearchRef = useRef<UserSearchRef>(null);
  const { data: team } = useTeam(workspaceId);
  const addWorkspaceMember = useAddWorkspaceMember();
  const updateRoleMember = useUpdateRoleMember();
  const removeMember = useRemoveMember();
  const router = useRouter();

  const existingMemberIds = team?.map((member) => member.user.id) || [];

  const onSubmit = useCallback(async () => {
    const ids = selectedUsers.map((user) => user.id);

    if (ids.length <= 0) {
      toast("Nenhum usuário selecionado");
      return;
    }

    setLoading(true);
    const response = await addWorkspaceMember.mutateAsync({
      workspaceId,
      invitationUsersId: ids,
      revalidatePaths: ["/dashboard", "/dashboard/Workspace"]
    });

    if (!isSuccessResponse(response)) {
      toast.error("Erro ao convidar usuário para Workspace");
      return;
    }

    toast.success(response.message);
    setSelectedUsers([]);
    userSearchRef.current?.reset();
    setLoading(false);
  }, [addWorkspaceMember, selectedUsers, workspaceId]);

  const executeRoleChange = useCallback(
    async (memberId: string, newRole: WorkspaceRole) => {
      try {
        const result = await updateRoleMember.mutateAsync({
          workspaceId,
          memberId,
          newRole,
          revalidatePaths: ["/dashboard", `/dashboard/Workspaces/${workspaceId}`]
        });
        if (!isSuccessResponse(result)) {
          toast.error("Erro ao alterar role");
        }

        toast.success(`Role alterada para ${badges[newRole].label}`);
        setConfirmDialog(null);
      } catch (error) {
        toast.error("Erro ao alterar role");
      }
    },
    [updateRoleMember, workspaceId]
  );

  const handleRoleChange = useCallback(
    async (memberId: string, currentRole: WorkspaceRole, newRole: WorkspaceRole) => {
      if (
        newRole === "OWNER" ||
        newRole === "ADMIN" ||
        currentRole === "OWNER" ||
        currentRole === "ADMIN"
      ) {
        setConfirmDialog({
          open: true,
          memberId,
          newRole,
          currentRole
        });
        return;
      }

      // Para outras roles, mudar direto
      await executeRoleChange(memberId, newRole);
    },
    [executeRoleChange]
  );

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      const result = await removeMember.mutateAsync({
        workspaceId,
        memberId,
        revalidatePaths: ["/dashboard", `/dashboard/Workspaces/${workspaceId}`]
      });
      if (!isSuccessResponse(result)) {
        toast.error("Erro ao remover membro");
        return;
      }
      toast.success(result.data);
    },
    [removeMember, workspaceId]
  );

  return {
    //dados
    team,
    // Estado
    selectedUsers,
    loading,
    confirmDialog,
    // Setters
    setSelectedUsers,
    setLoading,
    setConfirmDialog,
    // Ações
    addWorkspaceMember,
    updateRoleMember,
    removeMember,
    onSubmit,
    handleRoleChange,
    handleRemoveMember,
    router,
    executeRoleChange,
    userSearchRef,
    existingMemberIds
  };
}
