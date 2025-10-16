import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import { acceptWorkspaceInvitation } from "@/app/actions/workspace/accept-invite";
import { AcceptWorkspaceInvitationType } from "@/app/actions/workspace/accept-invite";
import {
  addWorkspaceMember,
  cancelWorkspaceInvitation,
  CancelWorkspaceInvitationType,
  createWorkspace,
  CreateWorkspaceType,
  declineWorkspaceInvitation,
  DeclineWorkspaceInvitationType,
  updateWorkspace,
  UpdateWorkspaceType
} from "@/app/actions/workspace";
import { AddWorkspaceMemberType } from "@/app/actions/workspace/add-member";
import { deleteWorkspace, DeleteWorkspaceType } from "@/app/actions/workspace/delete";

export function useCreateWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateWorkspaceType) => {
      const result = await createWorkspace(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: UpdateWorkspaceType) => {
      const result = await updateWorkspace(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", variables.workspaceId] });
    },
    retry: 1
  });
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteWorkspaceType) => {
      const result = await deleteWorkspace(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      // Remove tudo relacionado ao workspace do cache
      queryClient.removeQueries({
        queryKey: ["workspace", variables.workspaceId]
      });
      queryClient.removeQueries({
        queryKey: ["groups", variables.workspaceId]
      });
      queryClient.removeQueries({
        queryKey: ["priorities", variables.workspaceId]
      });
      queryClient.removeQueries({
        queryKey: ["status", variables.workspaceId]
      });

      // NÃO invalida nada - deixa quieto
    },
    retry: 1
  });
}

export function useAddWorkspaceMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddWorkspaceMemberType) => {
      const result = await addWorkspaceMember(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId, "members"]
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId, "invitations"]
      });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useAcceptWorkspaceInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AcceptWorkspaceInvitationType) => {
      const result = await acceptWorkspaceInvitation(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId]
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId, "members"]
      });
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    retry: 1
  });
}

export function useCancelWorkspaceInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CancelWorkspaceInvitationType) => {
      const result = await cancelWorkspaceInvitation(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", variables.invitationId, "invitations"] });

      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeclineWorkspaceInvitation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeclineWorkspaceInvitationType) => {
      const result = await declineWorkspaceInvitation(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result.data;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["workspace", variables.workspaceId, "invitations"] });
    },
    retry: 1
  });
}