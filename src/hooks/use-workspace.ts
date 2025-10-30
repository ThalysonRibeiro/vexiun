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
  Prisma,
  WorkspaceCategory,
  WorkspaceRole
} from "@/generated/prisma";
import { changeWorkspaceStatus } from "@/app/actions/workspace/change-status";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CACHE_TIMES } from "@/lib/constants";
import { useCallback, useState } from "react";
import { WorkspaceWithDetails } from "@/app/(panel)/dashboard/workspace/_components/workspaces-page-client";
import { toast } from "sonner";

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

export function useMoveWorkspaceToTrash() {
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


export type WorkspaceByStatus = Prisma.WorkspaceGetPayload<{
  include: {
    _count: {
      select: {
        groups: true,
        members: true,
      },
    },
    statusChanger: {
      select: {
        name: true,
        email: true
      }
    }
  },
}>

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
    enabled: !!status,
  });
}


type WorkspaceMemberDataResult = {
  success: true;
  data: {
    workspace: { status: string; userId: string };
    member: { role: string; userId: string };
  };
} | {
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
    staleTime: CACHE_TIMES.MEDIUM,
  });
}

export function useActionsWorkspaceList() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceWithDetails | null>(null);
  const archive = useArchiveWorkspace();
  const deleteWs = useMoveWorkspaceToTrash();

  const handleArchive = useCallback(async (workspaceId: string) => {
    const result = await archive.mutateAsync(workspaceId);
    if (!isSuccessResponse(result)) {
      toast.error("Erro ao arquivar");
    }
    toast.success(result.message);
  }, [archive]);

  const handleDelete = useCallback(async (workspaceId: string) => {
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
  }, [deleteWs]);

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
      lastActivityAt: workspace.lastActivityAt,
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
  }
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
    isLimitedAccess: ["MEMBER", "VIEWER"].includes(userRole),
  };
}