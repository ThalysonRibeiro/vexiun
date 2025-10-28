"use client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { memo } from "react"
import { Archive, ArchiveRestore, Edit, Ellipsis, Trash } from "lucide-react";

interface ActionGroupProps {
  groupId: string;
  onDeleteGroup: (groupId: string) => void;
  onMoveToTrash: (groupId: string) => void;
  onArchiveGroup: (groupId: string) => void;
  onRestoreGroup: (groupId: string) => void;
  onEditGroup: (groupId: string) => void;
}

export const ActionGroup = memo(function ActionGroup({
  groupId,
  onEditGroup,
  onArchiveGroup,
  onMoveToTrash,
  onRestoreGroup,
  onDeleteGroup
}: ActionGroupProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"} className="cursor-pointer">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel> Opções</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onArchiveGroup(groupId)}
        >
          <Archive /> Arquivar
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onRestoreGroup(groupId)}
        >
          <ArchiveRestore /> Restaurar
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => onEditGroup(groupId)}
        >
          <Edit /> Editar nome
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onMoveToTrash(groupId)}
          variant="destructive"
        >
          <Trash /> Deletar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDeleteGroup(groupId)}
          variant="destructive"
        >
          <Trash /> Deletar permanentemente
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
});