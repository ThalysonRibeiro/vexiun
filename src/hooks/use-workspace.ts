"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { acceptWorkspaceInvitation } from "@/app/actions/workspace/accept-invite";
import {
  AcceptWorkspaceInvitationType,
  addWorkspaceMember,
  AddWorkspaceMemberType,
  cancelWorkspaceInvitation,
  CancelWorkspaceInvitationType,
  ChangeStatusInput,
  createWorkspace,
  CreateWorkspaceType,
  declineWorkspaceInvitation,
  DeclineWorkspaceInvitationType,
  DeleteWorkspaceType,
  updateWorkspace,
  UpdateWorkspaceType,
  WorkspaceFormData,
  workspaceSchema
} from "@/app/actions/workspace";
import {
  deleteWorkspace,
} from "@/app/actions/workspace/delete";
import {
  EntityStatus,
  WorkspaceCategory,
  WorkspaceRole
} from "@/generated/prisma";
import { changeWorkspaceStatus } from "@/app/actions/workspace/change-status";
import { getWorkspacesByStatus } from "@/app/data-access/workspace";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";



export interface UseWorkspaceProps {
  initialValues?: {
    title: string;
    invitationUsersId: string[];
    description?: string;
    categories?: WorkspaceCategory[];
  }
}

export function useWorkspaceForm({ initialValues }: UseWorkspaceProps) {
  return useForm<WorkspaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: initialValues || {
      title: "",
      invitationUsersId: []
    }
  })
}


export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWorkspaceType) => {
      const result = await createWorkspace(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateWorkspaceType) => {
      const result = await updateWorkspace(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", variables.workspaceId] });
    },
    retry: 1
  });
}

/**
 * deletar permanente
 */
export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteWorkspaceType) => {
      const result = await deleteWorkspace(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      // Remove tudo relacionado ao workspace do cache
      queryClient.removeQueries({
        queryKey: ["workspace", variables.workspaceId]
      });
      queryClient.removeQueries({
        queryKey: ["groups", variables.workspaceId]
      });
      queryClient.removeQueries({
        queryKey: ["priorities", variables.workspaceId]
      });
      queryClient.removeQueries({
        queryKey: ["status", variables.workspaceId]
      });

      queryClient.invalidateQueries({ queryKey: ["workspaces"] });

      // NÃO invalida nada - deixa quieto
    },
    retry: 1
  });
}

export function useChangeWorkspaceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ChangeStatusInput) => {
      const result = await changeWorkspaceStatus(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
    }
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

export function useChangeWorkspace() {
  const changeStatus = useChangeWorkspaceStatus();

  return {
    ...changeStatus,
    mutateAsync: (workspaceId: string) =>
      changeStatus.mutateAsync({ workspaceId, newStatus: "DELETED" })
  };
}

export function useAddWorkspaceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddWorkspaceMemberType) => {
      const result = await addWorkspaceMember(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId, "members"]
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId, "invitations"]
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useAcceptWorkspaceInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AcceptWorkspaceInvitationType) => {
      const result = await acceptWorkspaceInvitation(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId]
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId, "members"]
      });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    retry: 1
  });
}

export function useCancelWorkspaceInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CancelWorkspaceInvitationType) => {
      const result = await cancelWorkspaceInvitation(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", variables.invitationId, "invitations"] });

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeclineWorkspaceInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeclineWorkspaceInvitationType) => {
      const result = await declineWorkspaceInvitation(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", variables.workspaceId, "invitations"] });
    },
    retry: 1
  });
}


type WorkspacesByStatusResult = Awaited<ReturnType<typeof getWorkspacesByStatus>>;
type WorkspacesByStatusData = Extract<WorkspacesByStatusResult, { success: true }>['data'];

/**
 * Busca workspaces com base no status
 */
export function useWorkspacesByStatus(status: EntityStatus) {
  return useQuery<WorkspacesByStatusData>({
    queryKey: ["workspaces", "by-status", status] as const,
    queryFn: async () => {
      const result = await getWorkspacesByStatus(status);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!status,
  });
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
    canManageMembers: canManageMembers(),
    canDeletePermanently: canDeletePermanently(),

    // Helpers
    isReadOnly: userRole === "VIEWER",
    isLimitedAccess: ["MEMBER", "VIEWER"].includes(userRole),
  };
}