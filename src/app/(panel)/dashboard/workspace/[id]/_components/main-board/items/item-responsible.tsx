"use client"
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { nameFallback } from "@/utils/name-fallback";
import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { memo } from "react";
import { ItemAssign } from "../../item-assign";
import { cn } from "@/lib/utils";

interface ItemResponsibleProps {
  item: ItemWhitCreatedAssignedUser;
  label: string;
  className?: string;
}

export const ItemResponsible = memo(function ItemResponsible({ item, label, className }: ItemResponsibleProps) {
  return (
    <div>
      {label && <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>}
      <Dialog>
        <DialogTrigger
          className="cursor-pointer w-full"
          title="Clique para designar um membro da equipe"
        >
          <div className={cn("flex items-center gap-2", className)}>
            <Avatar className="h-7 w-7">
              <AvatarImage src={item.assignedToUser?.image as string} />
              <AvatarFallback className="text-xs">
                {nameFallback(item.assignedToUser?.name as string)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate">
              {item.assignedToUser?.name?.split(" ")[0] ?? "CATALYST"}
            </span>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Membros da equipe</DialogTitle>
            <DialogDescription>
              Selecione um membro da equipe que será responsável por este item
            </DialogDescription>
          </DialogHeader>
          <ItemAssign
            itemId={item.id}
            assignedToUser={item.assignedToUser}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
});