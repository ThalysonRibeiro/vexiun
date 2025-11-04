"use client";
import { useQuery } from "@tanstack/react-query";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { acceptWorkspaceInvitation } from "@/app/actions/workspace/accept-invite";
import {
  addWorkspaceMember,
  cancelWorkspaceInvitation,
  createWorkspace,
  declineWorkspaceInvitation,
  updateWorkspace,
  WorkspaceFormData,
  workspaceSchema
} from "@/app/actions/workspace";
import { deleteWorkspace } from "@/app/actions/workspace/delete";
import { EntityStatus, Prisma, WorkspaceCategory, WorkspaceRole } from "@/generated/prisma";
import { changeWorkspaceStatus } from "@/app/actions/workspace/change-status";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CACHE_TIMES } from "@/lib/constants";
import { useCallback, useState } from "react";
import { WorkspaceWithDetails } from "@/app/(panel)/dashboard/workspace/_components/workspaces-page-client";
import { toast } from "sonner";
import { SentInvite } from "@/app/(panel)/dashboard/workspace/invites/types";
import { updateRoleMember } from "@/app/actions/workspace/update-role-member";
import { removeMember } from "@/app/actions/workspace/remove-member";
import { useMutationWithToast } from "./use-mutation-with-toast";

export interface UseWorkspaceProps {
  initialValues?: {
    title: string;
    invitationUsersId: string[];
    description?: string;
    categories?: WorkspaceCategory[];
  };
}

export function useWorkspaceForm({ initialValues }: UseWorkspaceProps) {
  return useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: initialValues || {
      title: "",
      categories: [],
      description: "",
      invitationUsersId: []
    }
  });
}

export function useCreateWorkspace() {
  return useMutationWithToast({
    mutationFn: createWorkspace,
    invalidateQueries: [["workspace"], ["notifications"]],
    successMessage: "Workspace criado com sucesso!",
    errorMessage: "Erro ao criar workspace"
  });
}

export function useUpdateWorkspace() {
  return useMutationWithToast({
    mutationFn: updateWorkspace,
    invalidateQueries: [["workspace"]],
    successMessage: "Workspace atualizado com sucesso!",
    errorMessage: "Erro ao atualizar workspace",
    retry: 1
  });
}

export function useDeleteWorkspace() {
  return useMutationWithToast({
    mutationFn: deleteWorkspace,
    invalidateQueries: [["workspace"], ["workspaces"], ["groups"], ["priorities"], ["status"]],
    successMessage: "Workspace deletado com sucesso!",
    errorMessage: "Erro ao deletar workspace",
    retry: 1
  });
}

export function useChangeWorkspaceStatus() {
  return useMutationWithToast({
    mutationFn: changeWorkspaceStatus,
    invalidateQueries: [["workspaces"]],
    successMessage: "Status atualizado com sucesso!",
    errorMessage: "Erro ao atualizar status",
    retry: 1
  });
}

// Helpers específicos
export function useArchiveWorkspace() {
  const changeStatus = useChangeWorkspaceStatus();

  return {
    ...changeStatus,
    mutateAsync: (workspaceId: string) =>
      changeStatus.mutateAsync({ workspaceId, newStatus: "ARCHIVED" })
  };
}

export function useRestoreWorkspace() {
  const changeStatus = useChangeWorkspaceStatus();

  return {
    ...changeStatus,
    mutateAsync: (workspaceId: string) =>
      changeStatus.mutateAsync({ workspaceId, newStatus: "ACTIVE" })
  };
}

export function useMoveWorkspaceToTrash() {
  const changeStatus = useChangeWorkspaceStatus();

  return {
    ...changeStatus,
    mutateAsync: (workspaceId: string) =>
      changeStatus.mutateAsync({ workspaceId, newStatus: "DELETED" })
  };
}

export function useAddWorkspaceMember() {
  return useMutationWithToast({
    mutationFn: addWorkspaceMember,
    invalidateQueries: [["workspace", "members"], ["invitations"], ["notifications"]],
    successMessage: "Membro adicionado com sucesso!",
    errorMessage: "Erro ao adicionar membro"
  });
}

export function useAcceptWorkspaceInvitation() {
  return useMutationWithToast({
    mutationFn: acceptWorkspaceInvitation,
    invalidateQueries: [["workspaces"], ["invitations"], ["notifications"]],
    successMessage: "Convite aceito com sucesso!",
    errorMessage: "Erro ao aceitar convite",
    retry: 1
  });
}

export function useCancelWorkspaceInvitation() {
  return useMutationWithToast({
    mutationFn: cancelWorkspaceInvitation,
    invalidateQueries: [["workspace"], ["invitations"], ["notifications"]],
    successMessage: "Convite cancelado com sucesso!",
    errorMessage: "Erro ao cancelar convite"
  });
}

export function useDeclineWorkspaceInvitation() {
  return useMutationWithToast({
    mutationFn: declineWorkspaceInvitation,
    invalidateQueries: [["workspace"], ["invitations"]],
    successMessage: "Convite recusado com sucesso!",
    errorMessage: "Erro ao recusar convite"
  });
}

export type WorkspaceByStatus = Prisma.WorkspaceGetPayload<{
  include: {
    _count: {
      select: {
        groups: true;
        members: true;
      };
    };
    statusChanger: {
      select: {
        name: true;
        email: true;
      };
    };
  };
}>;

export function useWorkspacesByStatus(status: EntityStatus) {
  return useQuery<WorkspaceByStatus[]>({
    queryKey: ["workspaces", "by-status", status],
    queryFn: async () => {
      const response = await fetch(`/api/workspace/by-status?status=${status}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!status
  });
}

type WorkspaceMemberDataResult =
  | {
      success: true;
      data: {
        workspace: { status: string; userId: string };
        member: { role: string; userId: string };
      };
    }
  | {
      success: false;
      error: string;
    };

export function useWorkspaceMemberData(workspaceId: string) {
  return useQuery({
    queryKey: ["workspaces", "workspace-member", workspaceId],
    queryFn: async () => {
      const response = await fetch(`/api/workspace/${workspaceId}/member`);
      const result: WorkspaceMemberDataResult = await response.json();

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!workspaceId,
    staleTime: CACHE_TIMES.MEDIUM
  });
}

export function useUpdateRoleMember() {
  return useMutationWithToast({
    mutationFn: updateRoleMember,
    invalidateQueries: [["workspace", "team"]],
    successMessage: (data) => data || "Role atualizada!",
    errorMessage: "Erro ao atualizar role"
  });
}

export function useRemoveMember() {
  return useMutationWithToast({
    mutationFn: removeMember,
    invalidateQueries: [["workspace"], ["team"]],
    successMessage: (data) => data || "Membro removido!",
    errorMessage: "Erro ao remover membro"
  });
}

export function useActionsWorkspaceList() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceWithDetails | null>(null);
  const archive = useArchiveWorkspace();
  const deleteWs = useMoveWorkspaceToTrash();

  const handleArchive = useCallback(
    async (workspaceId: string) => {
      const result = await archive.mutateAsync(workspaceId);
      if (!isSuccessResponse(result)) {
        toast.error("Erro ao arquivar");
      }
      toast.success(result.message);
    },
    [archive]
  );

  const handleDelete = useCallback(
    async (workspaceId: string) => {
      if (
        !confirm(
          "Deseja realmente mover para lixeira? Todos os grupos e items serão movidos para lixeira."
        )
      ) {
        return;
      }
      const result = await deleteWs.mutateAsync(workspaceId);
      if (!isSuccessResponse(result)) {
        toast.error("Erro ao deletar");
      }
      toast.success(result.message);
    },
    [deleteWs]
  );

  const handleSelectForEdit = useCallback((workspace: WorkspaceWithDetails) => {
    setSelectedWorkspace({
      userId: workspace.userId,
      id: workspace.id,
      title: workspace.title,
      groupsCount: workspace.groupsCount,
      itemsCount: workspace.itemsCount,
      members: workspace.members,
      menbersRole: workspace.menbersRole,
      categories: workspace.categories,
      status: workspace.status,
      statusChangedAt: workspace.statusChangedAt,
      description: workspace.description,
      statusChangedBy: workspace.statusChangedBy,
      lastActivityAt: workspace.lastActivityAt
    });
    setDropdownOpen(null);
    setTimeout(() => setIsOpen(true), 0);
  }, []);

  return {
    // Estado
    isOpen,
    dropdownOpen,
    selectedWorkspace,
    // Setters
    setIsOpen,
    setDropdownOpen,
    setSelectedWorkspace,
    // Ações
    handleArchive,
    handleDelete,
    handleSelectForEdit
  };
}

export function useActionWorkspaceInvites() {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const accept = useAcceptWorkspaceInvitation();
  const decline = useDeclineWorkspaceInvitation();
  const cancel = useCancelWorkspaceInvitation();

  const toggleSelect = useCallback((id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  }, []);

  const clearSelected = useCallback((ids: string[]) => {
    setSelected((s) => {
      const next = { ...s };
      ids.forEach((id) => delete next[id]);
      return next;
    });
  }, []);

  const selectAllInGroup = useCallback(
    (group: SentInvite[]) => {
      const next = { ...selected };
      group.forEach((i) => {
        next[i.id] = true;
      });
      setSelected(next);
    },
    [selected]
  );

  const unselectAllInGroup = useCallback(
    (group: SentInvite[]) => {
      const ids = group.map((i) => i.id);
      clearSelected(ids);
    },
    [clearSelected]
  );

  const setLoading = useCallback((id: string, value: boolean) => {
    setLoadingMap((s) => ({ ...s, [id]: value }));
  }, []);

  const handleAccept = useCallback(
    async (inviteId: string, workspaceId: string) => {
      if (loadingMap[inviteId]) return;
      setLoading(inviteId, true);
      try {
        await accept.mutateAsync({
          workspaceId,
          revalidatePaths: ["/dashboard/workspace/invites"]
        });
        toast.success("Convite aceito");
      } catch (err) {
        toast.error("Erro ao aceitar convite");
      } finally {
        setLoading(inviteId, false);
      }
    },
    [accept, loadingMap, setLoading]
  );

  const handleDecline = useCallback(
    async (inviteId: string, workspaceId: string) => {
      if (loadingMap[inviteId]) return;
      setLoading(inviteId, true);
      try {
        await decline.mutateAsync({
          workspaceId,
          revalidatePaths: ["/dashboard/workspace/invites"]
        });
        toast.success("Convite recusado");
      } catch (err) {
        toast.error("Erro ao recusar convite");
      } finally {
        setLoading(inviteId, false);
      }
    },
    [decline, loadingMap, setLoading]
  );

  const handleCancel = useCallback(
    async (inviteId: Array<string>) => {
      if (inviteId.some((id) => loadingMap[id])) return;
      setLoading(inviteId[0], true);
      try {
        await cancel.mutateAsync({
          invitationIds: inviteId,
          revalidatePaths: ["/dashboard/workspace/invites"]
        });
        toast.success("Convite cancelado");
      } catch (err) {
        toast.error("Erro ao cancelar convite");
      } finally {
        setLoading(inviteId[0], false);
      }
    },
    [cancel, loadingMap, setLoading]
  );

  return {
    // Estado
    loadingMap,
    selected,
    // Setters
    toggleSelect,
    clearSelected,
    selectAllInGroup,
    unselectAllInGroup,
    // Ações
    handleAccept,
    handleDecline,
    handleCancel
  };
}

interface UseWorkspacePermissionsProps {
  userRole: WorkspaceRole;
  workspaceStatus: EntityStatus;
  isOwner: boolean;
}

export function useWorkspacePermissions({
  userRole,
  workspaceStatus,
  isOwner
}: UseWorkspacePermissionsProps) {
  const canArchive = () => {
    // MEMBER e VIEWER não podem
    if (["MEMBER", "VIEWER"].includes(userRole)) return false;

    // Só pode arquivar se estiver ACTIVE
    if (workspaceStatus !== "ACTIVE") return false;

    // ADMIN e OWNER podem
    return ["ADMIN", "OWNER"].includes(userRole);
  };

  const canDelete = () => {
    // Só OWNER pode mover para lixeira
    if (!isOwner) return false;

    // Só pode deletar se ACTIVE ou ARCHIVED
    return ["ACTIVE", "ARCHIVED"].includes(workspaceStatus);
  };

  const canRestore = () => {
    // Não pode restaurar se já está ACTIVE
    if (workspaceStatus === "ACTIVE") return false;

    // Restaurar de DELETED só OWNER
    if (workspaceStatus === "DELETED") {
      return isOwner;
    }

    // Restaurar de ARCHIVED: ADMIN ou OWNER
    if (workspaceStatus === "ARCHIVED") {
      return ["ADMIN", "OWNER"].includes(userRole);
    }

    return false;
  };

  const canEdit = () => {
    // Só OWNER e ADMIN podem editar
    return ["ADMIN", "OWNER"].includes(userRole);
  };

  const canCreateGroup = () => {
    // Só OWNER e ADMIN podem criar grupos
    return ["ADMIN", "OWNER"].includes(userRole);
  };

  const canCreateOrEditItem = () => {
    return ["ADMIN", "OWNER", "MEMBER"].includes(userRole);
  };

  const canManageMembers = () => {
    // Só OWNER e ADMIN
    return ["ADMIN", "OWNER"].includes(userRole);
  };

  const canDeletePermanently = () => {
    // Só OWNER pode deletar permanentemente
    // E só se estiver na LIXEIRA
    return isOwner && workspaceStatus === "DELETED";
  };

  return {
    canArchive: canArchive(),
    canDelete: canDelete(),
    canRestore: canRestore(),
    canEdit: canEdit(),
    canCreateGroup: canCreateGroup(),
    canCreateOrEditItem: canCreateOrEditItem(),
    canManageMembers: canManageMembers(),
    canDeletePermanently: canDeletePermanently(),

    // Helpers
    isReadOnly: userRole === "VIEWER",
    isLimitedAccess: ["MEMBER", "VIEWER"].includes(userRole)
  };
}
