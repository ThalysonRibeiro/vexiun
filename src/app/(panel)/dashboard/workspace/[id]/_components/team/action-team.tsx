"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Ellipsis, Trash, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { memo } from "react";
import { WorkspaceRole } from "@/generated/prisma";

interface ListMembersProps {
  workspaceId: string;
  memberId: string;
  memberRole: WorkspaceRole;
  onRemoveMember: (memberId: string) => void;
  onRedirect: (value: string) => void;
}

export const ActionTeam = memo(function ActionTeam(props: ListMembersProps) {
  const { workspaceId, memberId, memberRole, onRemoveMember, onRedirect } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"} className="h-8 w-8">
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Opções</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onRedirect(`/dashboard/workspace/${workspaceId}/members/${memberId}`)}
          disabled={memberRole === "OWNER"}
          className="cursor-pointer"
        >
          <User className="w-4 h-4 mr-2" />
          Detalhes do membro
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onRemoveMember(memberId)}
          disabled={memberRole === "OWNER"}
          className="cursor-pointer"
        >
          <Trash className="w-4 h-4 mr-2" />
          Remover da equipe
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
