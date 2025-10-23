"use server";

import { changeWorkspaceStatus } from "./change-status";


export async function archiveWorkspace(workspaceId: string) {
  return changeWorkspaceStatus({
    workspaceId,
    newStatus: "ARCHIVED"
  });
}

export async function restoreWorkspace(workspaceId: string) {
  return changeWorkspaceStatus({
    workspaceId,
    newStatus: "ACTIVE"
  });
}

export async function deleteWorkspace(workspaceId: string) {
  return changeWorkspaceStatus({
    workspaceId,
    newStatus: "DELETED"
  });
}