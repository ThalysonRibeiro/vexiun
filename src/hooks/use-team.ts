import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSuccessResponse } from "@/utils/error-handler";
import { getTeam } from "@/app/data-access/team";


export type TeamResult = Awaited<ReturnType<typeof getTeam>>;
export type TeamData = Extract<TeamResult, { success: true }>['data'];

/**
 * Hook busta dados da equipe
 */
export function useTeam(workspaceId: string) {
  return useQuery<TeamData>({
    queryKey: ["team", workspaceId] as const,
    queryFn: async () => {
      const result = await getTeam(workspaceId);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    enabled: !!workspaceId,
  });
}

/**
* Hook para invalidar cache, Invalida todas as queries de equipe
*/
export function useInvalidateTeam() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["team"] });
  };
}
