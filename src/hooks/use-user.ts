import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSuccessResponse } from "@/utils/error-handler";
import { getDetailUser, searchUsers } from "@/app/data-access/user";
import {
  updateAvatar,
  UpdateAvatarType,
  updateName,
  UpdateNameType,
  updateSettings,
  UpdateSettingsType
} from "@/app/actions/user";

type UserResult = Awaited<ReturnType<typeof searchUsers>>;
type UserData = Extract<UserResult, { success: true }>['data'];

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

export function useInvalidateUser() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["user"] });
  };
}

export function useUpdateName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateNameType) => {
      const result = await updateName(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
    retry: 1
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSettingsType) => {
      const result = await updateSettings(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId, "settings"] });
    },
    retry: 1
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateAvatarType) => {
      const result = await updateAvatar(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.avatarUrl, "avatar"] });
    },
    retry: 1
  });
}