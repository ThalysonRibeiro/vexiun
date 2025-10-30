import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { getGroups } from "@/app/data-access/groupe";
import {
  ChangeGroupStatusType,
  createGroup,
  CreateGroupType,
  deleteGroup,
  DeleteGroupType,
  GroupFormData,
  groupFormSchema,
  updateGroup,
  UpdateGroupType
} from "@/app/actions/group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EntityStatus } from "@/generated/prisma";
import { getGroupItemByEntityStatus } from "@/app/data-access/groupe/get-item-by-entity-status";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { changeGroupStatus } from "@/app/actions/group/change-group-status";


export interface UseGroupFormProps {
  initialValues?: {
    title: string;
    textColor: string;
  }
}

export function UseGroupForm({ initialValues }: UseGroupFormProps) {
  return useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: initialValues || {
      title: "",
      textColor: "#FF3445"
    }
  })
}

export type GroupsResponse = Awaited<ReturnType<typeof getGroups>>;
export type GroupsData = Extract<GroupsResponse, { success: true }>['data'];

export function useGroups(workspaceId: string) {
  return useQuery({
    queryKey: ["groups", workspaceId] as const,
    queryFn: async () => {
      const result = await getGroups(workspaceId);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!workspaceId,
  });
}

export type GroupItemByEntityStatusResult = Awaited<ReturnType<typeof getGroupItemByEntityStatus>>;
export type GroupItemByEntityStatusData = Extract<GroupItemByEntityStatusResult, { success: true }>['data'];

export function useGroupItemByEntityStatus(workspaceId: string, status: EntityStatus) {
  return useQuery<GroupItemByEntityStatusData>({
    queryKey: ["groups", "items", "by-entity-status", workspaceId, status] as const,
    queryFn: async () => {
      const result = await getGroupItemByEntityStatus(workspaceId, status);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!workspaceId && !!status,
    refetchOnWindowFocus: true
  })
}

export function useInvalidateGreoups() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["groups"] });
  };
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGroupType) => {
      const result = await createGroup(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups", variables.workspaceId] });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateGroupType) => {
      const result = await updateGroup(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.removeQueries({ queryKey: ["groups", variables.groupId] });
      queryClient.invalidateQueries({
        queryKey: ["groups"],
        exact: false,
        refetchType: "active"
      });
    },
    retry: 1
  });
}

export function useChangeGroupStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ChangeGroupStatusType) => {
      const result = await changeGroupStatus(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      queryClient.removeQueries({ queryKey: ["groups", variables.groupId] });
    }
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteGroupType) => {
      const result = await deleteGroup(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.removeQueries({ queryKey: ["groups", variables.groupId] });
      queryClient.invalidateQueries({
        queryKey: ["groups"],
        exact: false,
        refetchType: "active"
      });
    },
    retry: 1
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
    setOpenGroups(prev => {
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

  const handleDeleteGroup = useCallback(async (groupId: string) => {
    try {
      if (!confirm('Deseja realmente deletar o grupo? todos os itens serão deletados junto')) {
        return;
      }
      await deleteGroup.mutateAsync({
        workspaceId,
        groupId,
        revalidatePaths: [`/dashboard/workspace/${workspaceId}`]
      });
      toast.success("Grupo deletado com sucesso!");
      setOpenGroups(prev => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
    } catch (error) {
      toast.error("Erro ao deletar grupo");
    }
  }, [deleteGroup, workspaceId]);

  const handleMoveToTrash = useCallback(async (groupId: string) => {
    if (!confirm('Deseja realmente mover para lixeira?')) {
      return;
    }

    setIsLoading(groupId);

    try {
      const response = await moveToTrash.mutateAsync(
        workspaceId, groupId,
      );

      if (!isSuccessResponse(response)) {
        toast.error("Erro ao deletar item");
        return;
      }

      toast.success("Group movido para lixeira com sucess!");
    } finally {
      setIsLoading(null);
    }
  }, [moveToTrash, workspaceId,]);

  const handleArchiveGroup = useCallback(async (groupId: string) => {
    setIsLoading(groupId);

    try {
      const response = await archivedGroup.mutateAsync(
        workspaceId, groupId,
      );

      if (!isSuccessResponse(response)) {
        toast.error("Erro ao arquivar Group");
        return;
      }

      toast.success("Group arquivado!");
    } finally {
      setIsLoading(null);
    }
  }, [workspaceId, archivedGroup]);

  const handleRestoreGroup = useCallback(async (groupId: string) => {
    setIsLoading(groupId);

    try {
      const response = await restoreGroup.mutateAsync(
        workspaceId, groupId,
      );

      if (!isSuccessResponse(response)) {
        toast.error("Erro ao restaurar Group");
        return;
      }

      toast.success("Group restaurado!");
    } finally {
      setIsLoading(null);
    }
  }, [workspaceId, restoreGroup]);

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

  }
}