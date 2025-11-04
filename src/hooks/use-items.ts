import {
  EditingField,
  DialogStateProps,
  EditingState
} from "@/app/(panel)/dashboard/workspace/[id]/_components/main-board/items/types";
import {
  createItem,
  deleteItem,
  ItemFormData,
  itemFormSchema,
  updateItem
} from "@/app/actions/item";
import { assignTo } from "@/app/actions/item/assign-to";
import { changeItemStatus } from "@/app/actions/item/change-status";
import { EntityStatus, Priority, Prisma, Status } from "@/generated/prisma";
import { fetchAPI } from "@/lib/api/fetch-api";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { JSONContent } from "@tiptap/core";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMutationWithToast } from "./use-mutation-with-toast";

export interface UseItemFormProps {
  initialValues?: {
    title: string;
    term: Date;
    priority: Priority;
    status: Status;
    notes?: string;
    description?: string;
    details?: JSONContent | null;
    assignedTo?: string | null;
  };
}

export function UseItemForm({ initialValues }: UseItemFormProps) {
  return useForm<ItemFormData>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: initialValues || {
      title: "",
      term: new Date(),
      priority: "STANDARD",
      status: "NOT_STARTED",
      notes: "",
      description: "",
      details: null,
      assignedTo: null
    }
  });
}

export type ItemWhitCreatedAssignedUser = Prisma.ItemGetPayload<{
  include: {
    createdByUser: {
      select: {
        id: true;
        name: true;
        image: true;
        email: true;
        createdBy: true;
      };
    };
    assignedToUser: {
      select: {
        id: true;
        name: true;
        image: true;
        email: true;
        createdBy: true;
      };
    };
  };
}>;

export function useItems(workspaceId: string, groupId: string) {
  return useQuery<ItemsByStatusResponse>({
    queryKey: ["items", groupId] as const,
    queryFn: async () => {
      return fetchAPI(`/api/workspace/${workspaceId}/groups/${groupId}/public-items`);
    },
    enabled: !!workspaceId && !!groupId,
    refetchOnWindowFocus: true
  });
}

type ItemsByStatusResponse = {
  response: ItemWhitCreatedAssignedUser[];
  itemsNotCompleted: ItemWhitCreatedAssignedUser[];
  statusDone: ItemWhitCreatedAssignedUser[];
  statusNotStarted: ItemWhitCreatedAssignedUser[];
  statusInProgress: ItemWhitCreatedAssignedUser[];
  statusStoped: ItemWhitCreatedAssignedUser[];
};

export function useItemsByStatus(workspaceId: string) {
  return useQuery<ItemsByStatusResponse>({
    queryKey: ["items", "by-status", workspaceId] as const,
    queryFn: async () => {
      return fetchAPI(`/api/workspace/${workspaceId}/groups/items/by-status`);
    },
    enabled: !!workspaceId,
    refetchOnWindowFocus: true
  });
}

export type ItemsAssociatedWithMemberResponse = {
  member: {
    joinedAt: Date;
  };
  items: {
    title: string;
    id: string;
    status: Status;
    term: Date;
    priority: Priority;
    assignedTo: string | null;
  }[];
};

export function useItemsAssociatedWithMember(workspaceId: string, memberId: string) {
  return useQuery<ItemsAssociatedWithMemberResponse>({
    queryKey: ["items", "associated-with-member", workspaceId, memberId] as const,
    queryFn: async () => {
      return fetchAPI(
        `/api/workspace/${workspaceId}/groups/items/associated-with-member?memberId=${memberId}`
      );
    },
    enabled: !!workspaceId && !!memberId,
    refetchOnWindowFocus: true
  });
}

export function usePrefetchMemberItems() {
  const queryClient = useQueryClient();

  const prefetch = (workspaceId: string, memberId: string) => {
    queryClient.prefetchQuery({
      queryKey: ["items", "associated-with-member", workspaceId, memberId] as const,
      queryFn: async () => {
        return fetchAPI(
          `/api/workspace/${workspaceId}/groups/items/associated-with-member?memberId=${memberId}`
        );
      },
      staleTime: 5 * 60 * 1000 // Cache por 5min
    });
  };

  return { prefetch };
}

export function useItemsByEntityStatus(workspaceId: string, groupId: string, status: EntityStatus) {
  return useQuery({
    queryKey: ["items", "by-entity-status", groupId, status] as const,
    queryFn: async () => {
      return fetchAPI(
        `/api/workspace/${workspaceId}/groups/${groupId}/item-by-entity-status?status=${status}`
      );
    },
    enabled: !!groupId && !!status,
    refetchOnWindowFocus: true
  });
}

export type ItemsCountByStatusResponse = {
  count: number;
};

export function useItemsCountByStatus(workspaceId: string, entityStatus: EntityStatus) {
  return useQuery<number | undefined>({
    queryKey: ["items", "items-count", workspaceId, entityStatus],
    queryFn: async () => {
      return fetchAPI(
        `/api/workspace/${workspaceId}/groups/items/count-by-status?status=${entityStatus}`
      );
    },
    enabled: !!workspaceId
  });
}

export function useInvalidateItems() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["items"] });
  };
}

export function useCreateItem() {
  return useMutationWithToast({
    mutationFn: createItem,
    invalidateQueries: [["items"], ["groups"]],
    successMessage: "Item criado com sucesso!",
    errorMessage: "Erro ao criar item"
  });
}

export function useUpdateItem() {
  return useMutationWithToast({
    mutationFn: updateItem,
    invalidateQueries: [["items"], ["groups"]],
    successMessage: "Item atualizado com sucesso!",
    errorMessage: "Erro ao atualizar item",
    retry: 1
  });
}

export function useAssignTo() {
  return useMutationWithToast({
    mutationFn: assignTo,
    invalidateQueries: [["items"]],
    successMessage: "Item atribuido com sucesso!",
    errorMessage: "Erro ao atribuir item",
    retry: 1
  });
}

export function useDeleteItem() {
  return useMutationWithToast({
    mutationFn: deleteItem,
    invalidateQueries: [["items"], ["groups"]],
    successMessage: "Item deletado com sucesso!",
    errorMessage: "Erro ao deletar item",
    retry: 1,
    exact: false,
    refetchType: "active"
  });
}

export function useChangeItemStatus() {
  return useMutationWithToast({
    mutationFn: changeItemStatus,
    invalidateQueries: [["items"], ["groups"]],
    removeQueries: [["items"]],
    successMessage: "Status atualizado com sucesso!",
    errorMessage: "Erro ao atualizar status",
    retry: 1
  });
}

// Helpers específicos
export function useArchiveItem() {
  const changeStatus = useChangeItemStatus();

  return {
    ...changeStatus,
    mutateAsync: (workspaceId: string, itemId: string) =>
      changeStatus.mutateAsync({ workspaceId, itemId, newStatus: "ARCHIVED" })
  };
}

export function useRestoreItem() {
  const changeStatus = useChangeItemStatus();

  return {
    ...changeStatus,
    mutateAsync: (workspaceId: string, itemId: string) =>
      changeStatus.mutateAsync({ workspaceId, itemId, newStatus: "ACTIVE" })
  };
}

export function useMoveItemToTrash() {
  const changeStatus = useChangeItemStatus();

  return {
    ...changeStatus,
    mutateAsync: (workspaceId: string, itemId: string) =>
      changeStatus.mutateAsync({ workspaceId, itemId, newStatus: "DELETED" })
  };
}

export function useItemActions(workspaceId: string) {
  const [dialogState, setDialogState] = useState<DialogStateProps>({
    isOpen: false,
    itemId: null,
    isEditing: false,
    content: null
  });
  const [editing, setEditing] = useState<EditingState>({ itemId: null, field: null });
  const [editingData, setEditingData] = useState<ItemWhitCreatedAssignedUser | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const archivedItem = useArchiveItem();
  const restoreItem = useRestoreItem();
  const moveToTrash = useMoveItemToTrash();

  const startEditing = useCallback((item: ItemWhitCreatedAssignedUser, field: EditingField) => {
    setEditing({ itemId: item.id, field });
    setEditingData({ ...item });
  }, []);

  const cancelEditing = useCallback(() => {
    setEditing({ itemId: null, field: null });
    setEditingData(null);
  }, []);

  const handleSaveDetails = useCallback(
    async (item: ItemWhitCreatedAssignedUser) => {
      if (!dialogState.content) return;

      setIsLoading(item.id);

      try {
        const result = await updateItem.mutateAsync({
          workspaceId,
          itemId: item.id,
          title: item.title,
          status: item.status,
          term: new Date(item.term),
          priority: item.priority,
          notes: item.notes,
          description: item.description,
          details: dialogState.content,
          assignedTo: item.assignedTo
        });

        if (!isSuccessResponse(result)) {
          toast.error("Erro ao atualizar detalhes");
          return;
        }

        toast.success("Detalhes atualizados com sucesso!");
        setDialogState({ isOpen: false, itemId: null, isEditing: false, content: null });
      } finally {
        setIsLoading(null);
      }
    },
    [dialogState.content, updateItem, workspaceId]
  );

  const handleSaveField = useCallback(
    async (item: ItemWhitCreatedAssignedUser) => {
      if (!editingData) return;

      setIsLoading(item.id);

      try {
        const response = await updateItem.mutateAsync({
          workspaceId,
          itemId: item.id,
          title: editingData.title,
          status: editingData.status,
          term: new Date(editingData.term),
          priority: editingData.priority,
          notes: editingData.notes,
          description: editingData.description
        });

        if (!isSuccessResponse(response)) {
          toast.error("Erro ao atualizar item");
          return;
        }

        toast.success("Item atualizado com sucesso!");
        cancelEditing();
      } finally {
        setIsLoading(null);
      }
    },
    [editingData, cancelEditing, updateItem, workspaceId]
  );

  const handleSelectChange = useCallback(
    async (
      item: ItemWhitCreatedAssignedUser,
      field: "priority" | "status",
      value: Priority | Status
    ) => {
      setIsLoading(item.id);

      try {
        const response = await updateItem.mutateAsync({
          workspaceId,
          itemId: item.id,
          title: item.title,
          status: field === "status" ? (value as Status) : item.status,
          term: new Date(item.term),
          priority: field === "priority" ? (value as Priority) : item.priority,
          notes: item.notes,
          description: item.description,
          details: item.details as JSONContent
        });

        if (!isSuccessResponse(response)) {
          toast.error("Erro ao atualizar item");
          return;
        }

        toast.success("Item atualizado!");
      } finally {
        setIsLoading(null);
      }
    },
    [updateItem, workspaceId]
  );

  const handleDeleteItem = useCallback(
    async (itemId: string) => {
      if (!confirm("Deseja realmente deletar o item permanentemente?")) {
        return;
      }

      setIsLoading(itemId);

      try {
        const response = await deleteItem.mutateAsync({
          workspaceId,
          itemId
        });

        if (!isSuccessResponse(response)) {
          toast.error("Erro ao deletar item");
          return;
        }

        toast.success("Item movido para lixeira com sucess!");
      } finally {
        setIsLoading(null);
      }
    },
    [deleteItem, workspaceId]
  );

  const handleMoveToTrash = useCallback(
    async (itemId: string) => {
      if (!confirm("Deseja realmente mover para lixeira?")) {
        return;
      }

      setIsLoading(itemId);

      try {
        const response = await moveToTrash.mutateAsync(workspaceId, itemId);

        if (!isSuccessResponse(response)) {
          toast.error("Erro ao deletar item");
          return;
        }

        toast.success("Item movido para lixeira com sucess!");
      } finally {
        setIsLoading(null);
      }
    },
    [moveToTrash, workspaceId]
  );

  const handleArchiveItem = useCallback(
    async (itemId: string) => {
      setIsLoading(itemId);

      try {
        const response = await archivedItem.mutateAsync(workspaceId, itemId);

        if (!isSuccessResponse(response)) {
          toast.error("Erro ao arquivar item");
          return;
        }

        toast.success("Item arquiovado!");
      } finally {
        setIsLoading(null);
      }
    },
    [workspaceId, archivedItem]
  );

  const handleRestoreItem = useCallback(
    async (itemId: string) => {
      setIsLoading(itemId);

      try {
        const response = await restoreItem.mutateAsync(workspaceId, itemId);

        if (!isSuccessResponse(response)) {
          toast.error("Erro ao restaurar item");
          return;
        }

        toast.success("Item restaurado!");
      } finally {
        setIsLoading(null);
      }
    },
    [workspaceId, restoreItem]
  );

  return {
    // Estado
    dialogState,
    editing,
    editingData,
    isLoading,
    // Setters
    setDialogState,
    setEditingData,
    // Ações
    startEditing,
    cancelEditing,
    handleSaveDetails,
    handleSaveField,
    handleSelectChange,
    handleDeleteItem,
    handleMoveToTrash,
    handleArchiveItem,
    handleRestoreItem
  };
}
