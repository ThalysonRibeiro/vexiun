"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { memo } from "react";
import { Archive, ArchiveRestore, Edit, Ellipsis, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useWorkspaceMemberData, useWorkspacePermissions } from "@/hooks/use-workspace";
import { useParams } from "next/navigation";
import { EntityStatus, WorkspaceRole } from "@/generated/prisma";

interface ActionGroupProps {
  status: EntityStatus;
  groupId: string;
  onDeleteGroup: (groupId: string) => void;
  onMoveToTrash: (groupId: string) => void;
  onArchiveGroup: (groupId: string) => void;
  onRestoreGroup: (groupId: string) => void;
  onEditGroup: (groupId: string) => void;
}

export const ActionGroup = memo(function ActionGroup(props: ActionGroupProps) {
  const {
    status: entityStatus,
    groupId,
    onEditGroup,
    onArchiveGroup,
    onMoveToTrash,
    onRestoreGroup,
    onDeleteGroup
  } = props;
  const { id: workspaceId } = useParams();
  const { data: session } = useSession();
  const { data: workspace } = useWorkspaceMemberData(workspaceId as string);

  const currentUserId = session?.user.id;
  const isOwner = workspace?.workspace.userId === currentUserId;
  const permissions = useWorkspacePermissions({
    userRole: (workspace?.member.role as WorkspaceRole) ?? "VIEWER",
    workspaceStatus: entityStatus as EntityStatus,
    isOwner
  });
  return (
    <>
      {(permissions.canEdit ||
        permissions.canArchive ||
        permissions.canDelete ||
        permissions.canRestore) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
              <Ellipsis />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {entityStatus === "ACTIVE" && permissions.canEdit && (
              <DropdownMenuItem onClick={() => onArchiveGroup(groupId)}>
                <Archive /> Arquivar
              </DropdownMenuItem>
            )}

            {(entityStatus === "ARCHIVED" || entityStatus === "DELETED") &&
              permissions.canRestore && (
                <DropdownMenuItem onClick={() => onRestoreGroup(groupId)}>
                  <ArchiveRestore /> Restaurar
                </DropdownMenuItem>
              )}

            {entityStatus === "ACTIVE" && permissions.canEdit && (
              <DropdownMenuItem onClick={() => onEditGroup(groupId)}>
                <Edit /> Editar nome
              </DropdownMenuItem>
            )}

            {(entityStatus === "ACTIVE" || entityStatus === "ARCHIVED") &&
              permissions.canDelete && (
                <DropdownMenuItem onClick={() => onMoveToTrash(groupId)} variant="destructive">
                  <Trash /> Deletar
                </DropdownMenuItem>
              )}

            {entityStatus === "DELETED" && permissions.canDeletePermanently && (
              <DropdownMenuItem onClick={() => onDeleteGroup(groupId)} variant="destructive">
                <Trash /> Deletar permanentemente
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
});
