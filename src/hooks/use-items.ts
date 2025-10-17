import { createItem, CreateItemType, deleteItem, DeleteItemType, updateItem, UpdateItemType } from "@/app/actions/item";
import { assignTo, AssignToType } from "@/app/actions/item/assign-to";
import {
  getCompletedItems,
  getItemsAssignedToUser,
  getItemsByStatus,
  getPublicItems
} from "@/app/data-access/item";
import { Prisma } from "@/generated/prisma";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export type ItemData = Awaited<ReturnType<typeof getPublicItems>>;

export type ItemWhitCreatedAssignedUser = Prisma.ItemGetPayload<{
  include: {
    createdByUser: {
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        createdBy: true,
      }
    },
    assignedToUser: {
      select: {
        id: true,
        name: true,
        image: true,
        email: true,
        createdBy: true,
      }
    },
  }
}>

export type ItemsResults = Awaited<ReturnType<typeof getPublicItems>>;
export type ItemsData = Extract<ItemsResults, { success: true }>['data'];

export function useItems(groupId: string) {
  return useQuery<ItemsData>({
    queryKey: ["items", groupId] as const,
    queryFn: async () => {
      const result = await getPublicItems(groupId);
      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;

    },
    enabled: !!groupId,
    refetchOnWindowFocus: true,
  });
};

export type CompletedItemsResults = Awaited<ReturnType<typeof getCompletedItems>>;
export type CompletedItemsData = Extract<CompletedItemsResults, { success: true }>['data'];

export function useCompletedItems(workspaceId: string) {
  return useQuery<CompletedItemsData>({
    queryKey: ["items", "completed", workspaceId] as const,
    queryFn: async () => {
      const result = await getCompletedItems(workspaceId);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!workspaceId,
    refetchOnWindowFocus: true,
  });
};

export type ItemsByStatusResult = Awaited<ReturnType<typeof getItemsByStatus>>;
export type ItemsByStatusData = Extract<ItemsByStatusResult, { success: true }>['data'];

export function useItemsByStatus(workspaceId: string) {
  return useQuery<ItemsByStatusData>({
    queryKey: ["items", "by-status", workspaceId] as const,
    queryFn: async () => {
      const result = await getItemsByStatus(workspaceId);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!workspaceId,
    refetchOnWindowFocus: true,
  });
}


export type ItemAssignedToUserResult = Awaited<ReturnType<typeof getItemsAssignedToUser>>;
export type ItemAssignedToUserData = Extract<ItemAssignedToUserResult, { success: true }>['data'];

export function useItemsAssignedToUser(assignedTo: string) {
  return useQuery<ItemAssignedToUserData>({
    queryKey: ["items", "assigned-to-user", assignedTo] as const,
    queryFn: async () => {
      const result = await getItemsAssignedToUser(assignedTo);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!assignedTo,
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

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["items", variables.groupId] });
    },
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
      })
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
        queryKey: ["items", "notifications"],
        exact: false,
        refetchType: "active"
      })
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