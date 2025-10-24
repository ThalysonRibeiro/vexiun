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
import { Archive, Ellipsis, Eye, Trash } from "lucide-react"
import { InfoItem } from "../info-item"
import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items"
import { memo } from "react"
import { TeamUser } from "./types"

interface ActionItemProps {
  item: ItemWhitCreatedAssignedUser;
  team: TeamUser[];
  isLoading: string | null;
  onDeleteItem: (itemId: string) => void;
  onArchiveItem: (itemId: string) => void;
}

export const ActionItem = memo(function ActionItem({
  item, team, isLoading, onDeleteItem, onArchiveItem
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
        <DropdownMenuItem
          disabled={isLoading === item.id}
          onClick={() => onArchiveItem(item.id)}
          className="cursor-pointer"
        >
          <Archive className="h-4 w-4" /> Arquivar
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          disabled={isLoading === item.id}
          onClick={() => onDeleteItem(item.id)}
          className="cursor-pointer"
        >
          <Trash className="h-4 w-4" /> Deletar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
})