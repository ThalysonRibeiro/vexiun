import {
  EditingField,
  DialogStateProps,
  EditingState
} from "@/app/(panel)/dashboard/workspace/[id]/_components/main-board/items/types";
import {
  AssignToType,
  ChangeStatusInputType,
  createItem,
  CreateItemType,
  deleteItem,
  DeleteItemType,
  ItemFormData,
  itemFormSchema,
  updateItem,
  UpdateItemType
} from "@/app/actions/item";
import { assignTo } from "@/app/actions/item/assign-to";
import { changeItemStatus } from "@/app/actions/item/change-status";
import { EntityStatus, Priority, Prisma, Status } from "@/generated/prisma";
import { fetchAPI } from "@/lib/api/fetch-api";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { JSONContent } from "@tiptap/core";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateItemType) => {
      const result = await createItem(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }
      console.log(result);

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["items", variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ["items", "by-status"] });
    }
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateItemType) => {
      const result = await updateItem(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.setQueryData(["items", variables.itemId], result.data);
      queryClient.invalidateQueries({
        queryKey: ["items"],
        exact: false,
        refetchType: "active"
      });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    retry: 1
  });
}

export function useAssignTo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AssignToType) => {
      const result = await assignTo(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.setQueryData(["items", variables.itemId, variables.workspaceId], result.data);
      queryClient.invalidateQueries({
        queryKey: ["items"],
        exact: false,
        refetchType: "active"
      });
    },
    retry: 1
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteItemType) => {
      const result = await deleteItem(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.removeQueries({ queryKey: ["items", variables.itemId] });
      queryClient.invalidateQueries({
        queryKey: ["items"],
        exact: false,
        refetchType: "active"
      });
    },
    retry: 1
  });
}

export function useChangeItemStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: ChangeStatusInputType) => {
      const result = await changeItemStatus(data);
      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.removeQueries({ queryKey: ["items", variables.itemId] });
    }
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

// / ❌ CREATE - SEM retry (pode duplicar)
// export function useCreateItem() {
//   return useMutation({
//     mutationFn: itemsApi.createItem,
//     // retry: 0 (usa o padrão)
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
//     },
//   });
// }

// // ✅ UPDATE - COM retry (idempotente)
// export function useUpdateItem() {
//   return useMutation({
//     mutationFn: ({ id, data }) => itemsApi.updateItem(id, data),
//     retry: 1, // ✅ Seguro - atualizar N vezes = mesmo resultado
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
//     },
//   });
// }

// // ✅ DELETE - COM retry (idempotente)
// export function useDeleteItem() {
//   return useMutation({
//     mutationFn: itemsApi.deleteItem,
//     retry: 1, // ✅ Seguro - deletar N vezes = mesmo resultado
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: itemsKeys.lists() });
//     },
//   });
// }
