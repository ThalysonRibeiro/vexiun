"use client";

import { ActionResponse, isErrorResponse } from "@/lib/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type MutationConfig<TData, TVariables> = {
  mutationFn: (variables: TVariables) => Promise<ActionResponse<TData>>;
  invalidateQueries?: string[][];
  removeQueries?: string[][];
  successMessage?: string | ((data: TData) => string);
  errorMessage?: string;
  onSuccessCallback?: (data: TData, variables: TVariables) => void;
  retry?: number;
  exact?: boolean;
  refetchType?: "all" | "active";
};

/**
 * Hook genérico para mutations com toast automático
 *
 * Features:
 * - Toast de sucesso/erro automático
 * - Invalidação de queries automática
 * - Type-safe
 * - Consistente em toda aplicação
 *
 * @example
 * export function useCreateItem() {
 *   return useMutationWithToast({
 *     mutationFn: createItem,
 *     invalidateQueries: [["items"]],
 *     successMessage: "Item criado!"
 *   });
 * }
 */
export function useMutationWithToast<TData = unknown, TVariables = unknown>({
  mutationFn,
  invalidateQueries,
  removeQueries,
  successMessage,
  errorMessage,
  onSuccessCallback,
  retry,
  exact,
  refetchType
}: MutationConfig<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables) => {
      const result = await mutationFn(variables);

      if (isErrorResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess(result, variables, onMutateResult, context) {
      invalidateQueries?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey, exact, refetchType });
      });
      removeQueries?.forEach((queryKey) => {
        queryClient.invalidateQueries({ queryKey, exact, refetchType });
      });

      const message =
        typeof successMessage === "function"
          ? successMessage(result.data as TData)
          : successMessage || result.message || "Operação realizada com sucesso";

      toast.success(message);

      onSuccessCallback?.(result.data as TData, variables);
    },
    onError(error: Error) {
      toast.error(errorMessage || "Erro ao realizar operação", { description: error.message });
    },
    retry: retry
  });
}

/*
export function useCreateWorkspace() {
  return useMutationWithToast({
    mutationFn: createWorkspace,
    invalidateQueries: [["workspace"], ["notifications"]],
    successMessage: "Workspace criado com sucesso!",
    errorMessage: "Erro ao criar workspace"
  });
}

// Hook com lógica adicional no onSuccess
export function useCreateWorkspace(onWorkspaceCreated?: (id: string) => void) {
  return useMutationWithToast({
    mutationFn: createWorkspace,
    invalidateQueries: [["workspace"], ["notifications"]],
    successMessage: "Workspace criado com sucesso!",
    onSuccessCallback: (data) => {
      onWorkspaceCreated?.(data.workspaceId);
    }
  });
}
*/
