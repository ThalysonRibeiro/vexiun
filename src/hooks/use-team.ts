import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api/fetch-api";

type TeamResponse = {
  id: string;
  name: string | null;
  image: string | null;
  email: string;
}[];

export function useTeam(workspaceId: string) {
  return useQuery<TeamResponse>({
    queryKey: ["team", workspaceId] as const,
    queryFn: async () => {
      return fetchAPI(`/api/workspace/${workspaceId}/team`);
    },
    enabled: !!workspaceId
  });
}

export function useTeamCount(workspaceId: string) {
  return useQuery<number | undefined>({
    queryKey: ["team", "team-count", workspaceId] as const,
    queryFn: async () => {
      return fetchAPI(`/api/workspace/${workspaceId}/team/counts`);
    },
    enabled: !!workspaceId
  });
}

export function useInvalidateTeam() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["team"] });
  };
}
