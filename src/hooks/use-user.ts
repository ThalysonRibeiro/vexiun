import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import {
  updateAvatar,
  UpdateAvatarType,
  updateName,
  updateSettings,
  UpdateSettingsType
} from "@/app/actions/user";
import {
  NameFormData,
  nameFormSchema,
  SettingsFormData,
  settingsFormSchema,
  UpdateNameType
} from "@/app/actions/user/user-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchAPI } from "@/lib/api/fetch-api";

export interface UseNameFormProps {
  initialValues?: {
    name: string;
  };
}

export function UseNameForm({ initialValues }: UseNameFormProps) {
  return useForm<NameFormData>({
    resolver: zodResolver(nameFormSchema),
    defaultValues: initialValues || {
      name: ""
    }
  });
}

export interface UseSettingsFormProps {
  initialValues?: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    language: string;
    timezone: string;
  };
}

export function UseSettingsForm({ initialValues }: UseSettingsFormProps) {
  return useForm<SettingsFormData>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: initialValues || {
      emailNotifications: true,
      pushNotifications: true,
      language: "pt-BR",
      timezone: "America/Sao_Paulo"
    }
  });
}

type UserResponse = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}[];

export function useUserSearch(query: string, excludeUserIds: string[] = []) {
  return useQuery<UserResponse>({
    queryKey: ["user", "search", query, excludeUserIds] as const,
    queryFn: async () => {
      const result: UserResponse = await fetchAPI(`/api/user/search-users?query=${query}`);

      return excludeUserIds.length > 0
        ? result?.filter((user) => !excludeUserIds.includes(user.id))
        : result;
    },
    enabled: query.trim().length >= 2
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
