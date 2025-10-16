import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { getGroups } from "@/app/data-access/groupe";
import { createGroup, CreateGroupType, deleteGroup, DeleteGroupType, updateGroup, UpdateGroupType } from "@/app/actions/group";

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
      queryClient.invalidateQueries({ queryKey: ["group", variables.workspaceId] });
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
      queryClient.removeQueries({ queryKey: ["group", variables.groupId] });
      queryClient.invalidateQueries({
        queryKey: ["group"],
        exact: false,
        refetchType: "active"
      });
    },
    retry: 1
  });
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
      queryClient.removeQueries({ queryKey: ["group", variables.groupId] });
      queryClient.invalidateQueries({
        queryKey: ["group"],
        exact: false,
        refetchType: "active"
      });
    },
    retry: 1
  });
}