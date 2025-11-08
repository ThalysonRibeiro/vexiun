import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import {
  createGroup,
  deleteGroup,
  GroupFormData,
  groupFormSchema,
  updateGroup
} from "@/app/actions/group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntityStatus, Priority, Status } from "@/generated/prisma";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { changeGroupStatus } from "@/app/actions/group/change-group-status";
import { fetchAPI } from "@/lib/api/fetch-api";
import { ItemWhitCreatedAssignedUser } from "./use-items";
import { useMutationWithToast } from "./use-mutation-with-toast";

export interface UseGroupFormProps {
  initialValues?: {
    title: string;
    textColor: string;
  };
}

export function UseGroupForm({ initialValues }: UseGroupFormProps) {
  return useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: initialValues || {
      title: "",
      textColor: "#FF3445"
    }
  });
}

type GroupsResponse = {
  group: {
    id: string;
    title: string;
    textColor: string;
    workspaceId: string;
    status: EntityStatus;
    createdAt: string;
    updatedAt: string;
    item: {
      id: string;
      status: Status;
      priority: Priority;
    }[];
    _count: {
      item: number;
    };
    doneCount: number;
    pendingCount: number;
    totalItems: number;
  }[];
  itemsCompletedCount: number;
  totalItems: number;
};

export function useGroups(workspaceId: string) {
  return useQuery<GroupsResponse>({
    queryKey: ["groups", workspaceId] as const,
    queryFn: async () => {
      // const params = new URLSearchParams();
      // if (cursor) {
      //   params.append("cursor", cursor)
      // };
      // params.append("take", take.toString());

      return await fetchAPI(`/api/workspace/${workspaceId}/groups`);
    },
    enabled: !!workspaceId
  });
}

export type GroupItemByEntityStatusResponse = {
  id: string;
  title: string;
  textColor: string;
  workspaceId: string;
  status: EntityStatus;
  createdAt: string;
  updatedAt: string;
  item: ItemWhitCreatedAssignedUser[];
};

export function useGroupItemByEntityStatus(workspaceId: string, status: EntityStatus) {
  return useQuery<GroupItemByEntityStatusResponse[]>({
    queryKey: ["groups", "items", "by-entity-status", workspaceId, status] as const,
    queryFn: async () => {
      return await fetchAPI(
        `/api/workspace/${workspaceId}/groups/item-by-entity-status?status=${status}`
      );
    },
    enabled: !!workspaceId && !!status,
    refetchOnWindowFocus: true
  });
}

export function useInvalidateGreoups() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["groups"] });
  };
}

export function useCreateGroup() {
  return useMutationWithToast({
    mutationFn: createGroup,
    invalidateQueries: [["groups"]],
    successMessage: "Grupo criado com sucesso!",
    errorMessage: "Erro ao criar grupo"
  });
}

export function useUpdateGroup() {
  return useMutationWithToast({
    mutationFn: updateGroup,
    invalidateQueries: [["groups"]],
    successMessage: "Grupo atualizado com sucesso!",
    errorMessage: "Erro ao atualizar grupo",
    retry: 1,
    exact: false,
    refetchType: "active"
  });
}

export function useChangeGroupStatus() {
  return useMutationWithToast({
    mutationFn: changeGroupStatus,
    invalidateQueries: [["groups"], ["items", "items-count"]],
    successMessage: "Status atualizado com sucesso!",
    errorMessage: "Erro ao atualizar status",
    retry: 1
  });
}

export function useArchiveGroup() {
  const changeStatus = useChangeGroupStatus();

  return {
    ...changeStatus,
    mutateAsync: (workspaceId: string, groupId: string) =>
      changeStatus.mutateAsync({ workspaceId, groupId, status: "ARCHIVED" })
  };
}

export function useRestoreGroup() {
  const changeStatus = useChangeGroupStatus();

  return {
    ...changeStatus,
    mutateAsync: (workspaceId: string, groupId: string) =>
      changeStatus.mutateAsync({ workspaceId, groupId, status: "ACTIVE" })
  };
}

export function useMoveGroupToTrash() {
  const changeStatus = useChangeGroupStatus();

  return {
    ...changeStatus,
    mutateAsync: (workspaceId: string, groupId: string) =>
      changeStatus.mutateAsync({ workspaceId, groupId, status: "DELETED" })
  };
}

export function useDeleteGroup() {
  return useMutationWithToast({
    mutationFn: deleteGroup,
    invalidateQueries: [["groups"]],
    successMessage: "Grupo deletado com sucesso!",
    errorMessage: "Erro ao deletar grupo",
    retry: 1,
    exact: false,
    refetchType: "active"
  });
}

export function useGroupActions(workspaceId: string) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const deleteGroup = useDeleteGroup();
  const archivedGroup = useArchiveGroup();
  const restoreGroup = useRestoreGroup();
  const moveToTrash = useMoveGroupToTrash();

  const toggleDropdown = useCallback((groupId: string) => {
    setOpenGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  }, []);

  const handleEditGroup = useCallback((groupId: string) => {
    setEditingGroupId(groupId);
  }, []);

  const closeEditForm = useCallback((value: boolean) => {
    if (!value) {
      setEditingGroupId(null);
    }
    return value;
  }, []);

  const closeAddGroupForm = useCallback((value: boolean) => {
    setIsAddingGroup(value);
    return value;
  }, []);

  const handleDeleteGroup = useCallback(
    async (groupId: string) => {
      try {
        if (!confirm("Deseja realmente deletar o grupo? todos os itens serão deletados junto")) {
          return;
        }
        await deleteGroup.mutateAsync({
          workspaceId,
          groupId,
          revalidatePaths: [`/dashboard/workspace/${workspaceId}`]
        });
        toast.success("Grupo deletado com sucesso!");
        setOpenGroups((prev) => {
          const newSet = new Set(prev);
          newSet.delete(groupId);
          return newSet;
        });
      } catch (error) {
        toast.error("Erro ao deletar grupo");
      }
    },
    [deleteGroup, workspaceId]
  );

  const handleMoveToTrash = useCallback(
    async (groupId: string) => {
      if (!confirm("Deseja realmente mover para lixeira?")) {
        return;
      }

      setIsLoading(groupId);

      try {
        const response = await moveToTrash.mutateAsync(workspaceId, groupId);

        if (!isSuccessResponse(response)) {
          toast.error("Erro ao deletar item");
          return;
        }

        toast.success("Group movido para lixeira com sucess!");
      } finally {
        setIsLoading(null);
      }
    },
    [moveToTrash, workspaceId]
  );

  const handleArchiveGroup = useCallback(
    async (groupId: string) => {
      setIsLoading(groupId);

      try {
        const response = await archivedGroup.mutateAsync(workspaceId, groupId);

        if (!isSuccessResponse(response)) {
          toast.error("Erro ao arquivar Group");
          return;
        }

        toast.success("Group arquivado!");
      } finally {
        setIsLoading(null);
      }
    },
    [workspaceId, archivedGroup]
  );

  const handleRestoreGroup = useCallback(
    async (groupId: string) => {
      setIsLoading(groupId);

      try {
        const response = await restoreGroup.mutateAsync(workspaceId, groupId);

        if (!isSuccessResponse(response)) {
          toast.error("Erro ao restaurar Group");
          return;
        }

        toast.success("Group restaurado!");
      } finally {
        setIsLoading(null);
      }
    },
    [workspaceId, restoreGroup]
  );

  return {
    // Estado
    isLoading,
    isAddingGroup,
    editingGroupId,
    openGroups,
    // Setters
    setIsAddingGroup,
    // Ações
    toggleDropdown,
    handleEditGroup,
    closeEditForm,
    closeAddGroupForm,
    handleDeleteGroup,
    handleMoveToTrash,
    handleArchiveGroup,
    handleRestoreGroup
  };
}
