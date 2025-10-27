"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Archive, ArchiveRestore, Ellipsis, Eye, Trash } from "lucide-react"
import { InfoItem } from "./info-item"
import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items"
import { memo } from "react"
import { TeamUser } from "./types"
import { EntityStatus } from "@/generated/prisma"

interface ActionItemProps {
  item: ItemWhitCreatedAssignedUser;
  team: TeamUser[];
  isLoading: boolean | string | null;
  entityStatus?: EntityStatus;
  isDone?: boolean;
  onDeleteItem: (itemId: string) => void;
  onMoveToTrash: (itemId: string) => void;
  onArchiveItem: (itemId: string) => void;
  onRestoreItem: (itemId: string) => void;
}

export const ActionItem = memo(function ActionItem({
  item,
  team,
  isLoading,
  entityStatus,
  isDone = false,
  onDeleteItem,
  onMoveToTrash,
  onArchiveItem,
  onRestoreItem,
}: ActionItemProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer" asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Ellipsis className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-1">
        <DropdownMenuLabel>Ações</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {entityStatus === "ACTIVE" && (
          <Sheet>
            <DropdownMenuItem
              asChild
              onSelect={(e) => e.preventDefault()}
            >
              <SheetTrigger className="flex items-center gap-2 cursor-pointer w-full">
                <Eye className="h-4 w-4" /> Visualizar
              </SheetTrigger>
            </DropdownMenuItem>
            <InfoItem data={item} team={team} />
          </Sheet>
        )}

        {entityStatus !== "ARCHIVED" && entityStatus !== "DELETED" && (
          <DropdownMenuItem
            disabled={isLoading === item.id}
            onClick={() => onArchiveItem(item.id)}
            className="cursor-pointer"
          >
            <Archive className="h-4 w-4" /> Arquivar
          </DropdownMenuItem>
        )}

        {entityStatus !== "ACTIVE" && !isDone && (
          <DropdownMenuItem
            disabled={isLoading === item.id}
            onClick={() => onRestoreItem(item.id)}
            className="cursor-pointer"
          >
            <ArchiveRestore className="h-4 w-4" /> Restaurar
          </DropdownMenuItem>
        )}

        {!isDone && (entityStatus === "ACTIVE" || entityStatus === "ARCHIVED") && (
          <DropdownMenuItem
            variant="destructive"
            disabled={isLoading === item.id}
            onClick={() => onMoveToTrash(item.id)}
            className="cursor-pointer"
          >
            <Trash className="h-4 w-4" />
            Mover para lixeira
          </DropdownMenuItem>
        )}
        {entityStatus === "DELETED" && (
          <DropdownMenuItem
            variant="destructive"
            disabled={isLoading === item.id}
            onClick={() => onDeleteItem(item.id)}
            className="cursor-pointer"
          >
            <Trash className="h-4 w-4" />
            Deletar permanentemente
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
})