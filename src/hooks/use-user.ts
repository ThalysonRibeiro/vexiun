import { useQuery, useQueryClient } from "@tanstack/react-query";
import { updateAvatar, updateName, updateSettings } from "@/app/actions/user";
import {
  NameFormData,
  nameFormSchema,
  SettingsFormData,
  settingsFormSchema
} from "@/app/actions/user/user-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchAPI } from "@/lib/api/fetch-api";
import { useMutationWithToast } from "./use-mutation-with-toast";

export interface UseNameFormProps {
  initialValues?: {
    name: string;
  };
}

export function useNameForm({ initialValues }: UseNameFormProps) {
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
  return useMutationWithToast({
    mutationFn: updateName,
    invalidateQueries: [["user"]],
    successMessage: "Nome atualizado com sucesso!",
    errorMessage: "Erro ao atualizar nome",
    retry: 1
  });
}

export function useUpdateSettings() {
  return useMutationWithToast({
    mutationFn: updateSettings,
    invalidateQueries: [["user", "settings"]],
    successMessage: "Configurações atualizadas com sucesso!",
    errorMessage: "Erro ao atualizar configurações",
    retry: 1
  });
}

export function useUpdateAvatar() {
  return useMutationWithToast({
    mutationFn: updateAvatar,
    invalidateQueries: [["user", "avatar"]],
    successMessage: "Avatar atualizado com sucesso!",
    errorMessage: "Erro ao atualizar avatar",
    retry: 1
  });
}
