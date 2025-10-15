import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSuccessResponse } from "@/utils/error-handler";
import { searchUsers } from "@/app/data-access/user";

type UserResult = Awaited<ReturnType<typeof searchUsers>>;
type UserData = Extract<UserResult, { success: true }>['data'];

/**
 * Hook procura usuarios
 */
export function useUserSearch(query: string, excludeUserIds: string[] = []) {
  return useQuery<UserData>({
    queryKey: ["user", "search", query, excludeUserIds] as const,
    queryFn: async () => {
      const result = await searchUsers(query);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return excludeUserIds.length > 0
        ? result?.data?.filter(user => !excludeUserIds.includes(user.id))
        : result.data;
    },
    enabled: query.trim().length >= 2,
  });
}


/**
* Hook para invalidar cache, Invalida todas as queries de user
*/
export function useInvalidateUser() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };
}