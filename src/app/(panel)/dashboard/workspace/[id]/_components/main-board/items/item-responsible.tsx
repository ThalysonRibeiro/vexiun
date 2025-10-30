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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { nameFallback } from "@/utils/name-fallback";
import { ItemWhitCreatedAssignedUser } from "@/hooks/use-items";
import { memo, useState } from "react";
import { ItemAssign } from "../../item-assign";
import { cn } from "@/lib/utils";


interface ItemResponsibleProps {
  item: ItemWhitCreatedAssignedUser;
  label: string;
  permissionsEdit: boolean;
  className?: string;
}

export const ItemResponsible = memo(function ItemResponsible(props: ItemResponsibleProps) {
  const { item, label, permissionsEdit, className } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>

      {label && <div className="text-xs font-medium text-muted-foreground mb-1.5">{label}</div>}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger
              className="w-full"
              onClick={(e) => !permissionsEdit && e.preventDefault()}
              disabled={!permissionsEdit}
            >
              <div className={cn(
                "flex items-center gap-2",
                permissionsEdit && "cursor-pointer hover:opacity-80 transition-opacity",
                className
              )}>
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
          </TooltipTrigger>
          <TooltipContent>
            {permissionsEdit
              ? "Clique para designar um responsável"
              : "Você não tem permissão para alterar o responsável"}
          </TooltipContent>
        </Tooltip>

        {permissionsEdit && (
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
        )}
      </Dialog>
    </div>
  );
});