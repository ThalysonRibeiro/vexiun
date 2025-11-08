"use client";
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Archive, Edit2, Ellipsis, LinkIcon, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspacePermissions } from "@/hooks/use-workspace";
import { useSession } from "next-auth/react";
import { WorkspaceWithDetails } from "./workspaces-page-client";
import { memo } from "react";

interface ActionsWorkspaceListPorps {
  onOpenChange: (value: string | null) => void;
  open: boolean;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onRedirect: (id: string) => void;
  onEdit: (workspace: WorkspaceWithDetails) => void;
  workspace: WorkspaceWithDetails;
}

export const ActionsWorkspaceList = memo(function ActionsWorkspaceList(
  props: ActionsWorkspaceListPorps
) {
  const { workspace, onOpenChange, open, onArchive, onRedirect, onEdit, onDelete } = props;
  const { data } = useSession();
  const currentUserId = data?.user.id;
  const isOwner = workspace.userId === currentUserId;
  const permissions = useWorkspacePermissions({
    userRole: workspace?.menbersRole ?? "VIEWER",
    workspaceStatus: workspace.status,
    isOwner
  });
  return (
    <>
      {(permissions.canEdit ||
        permissions.canArchive ||
        permissions.canDelete ||
        permissions.canRestore ||
        permissions.isLimitedAccess) && (
        <DropdownMenu open={open} onOpenChange={(open) => onOpenChange(open ? workspace.id : null)}>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"} className="cursor-pointer">
              <Ellipsis className="h-4 w-4" />
              <span className="sr-only">Abrir menu de ações</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem className="cursor-pointer" onClick={() => onRedirect(workspace.id)}>
              <LinkIcon /> ir para workspace
            </DropdownMenuItem>

            {permissions.canEdit && workspace.status === "ACTIVE" && (
              <DropdownMenuItem className="cursor-pointer" onClick={() => onEdit(workspace)}>
                <Edit2 /> Editar ou convidar
              </DropdownMenuItem>
            )}

            {permissions.canArchive && (
              <DropdownMenuItem className="cursor-pointer" onClick={() => onArchive(workspace.id)}>
                <Archive /> Arquivar
              </DropdownMenuItem>
            )}

            {permissions.canDelete && (
              <DropdownMenuItem
                className="cursor-pointer"
                variant="destructive"
                onClick={() => onDelete(workspace?.id)}
              >
                <Trash /> Mover para lixeira
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
});
