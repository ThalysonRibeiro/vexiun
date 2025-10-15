import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSuccessResponse } from "@/utils/error-handler";
import { getGroups } from "@/app/data-access/groupe";

export type GroupsResponse = Awaited<ReturnType<typeof getGroups>>;
export type GroupsData = Extract<GroupsResponse, { success: true }>['data'];

/**
 * Hook para buscar grupos
 */
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

/**
* Hook para invalidar cache, Invalida todas as queries de grupos
*/
export function useInvalidateGreoups() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["groups"] });
  };
}