import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSuccessResponse } from "@/utils/error-handler";
import { getMyFriends } from "@/app/data-access/friendship";

export type MyFrendseResult = Awaited<ReturnType<typeof getMyFriends>>;
export type MyFrendseData = Extract<MyFrendseResult, { success: true }>['data'];

/**
 * Hook description
 */
export function useMyFrendse() {
  return useQuery<MyFrendseData>({
    queryKey: ["my-frends",] as const,
    queryFn: async () => {
      const result = await getMyFriends();

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    // enabled: !!userId,
  });
}


export function useInvalidateMyFrendse() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["my-frends"] });
  };
}