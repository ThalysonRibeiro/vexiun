"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { memo } from "react"
import { CreateOrEditItemForm } from "../create-or-edit-item-form";
import { TeamUser } from "../items/types";
import { cn } from "@/lib/utils";

interface NewItemProps {
  groupId: string;
  team: TeamUser[];
  openDialogs: Set<string>;
  setOpenDialogs: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export const NewItem = memo(function NewItem({
  groupId,
  team,
  openDialogs,
  setOpenDialogs
}: NewItemProps) {
  return (
    <Dialog
      open={openDialogs.has(groupId)}
      onOpenChange={(open) => {
        setOpenDialogs(prev => {
          const newSet = new Set(prev);
          if (open) {
            newSet.add(groupId);
          } else {
            newSet.delete(groupId);
          }
          return newSet;
        });
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("mt-4",)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo item
        </Button>
      </DialogTrigger>
      <DialogContent className="min-h-[400px] max-h-[calc(100dvh-3rem)] min-w-[calc(100dvw-20rem)] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>Cadastrar novo item</DialogTitle>
        </DialogHeader>
        <CreateOrEditItemForm
          groupId={groupId}
          closeForm={() => {
            setOpenDialogs(prev => {
              const newSet = new Set(prev);
              newSet.delete(groupId);
              return newSet;
            });
          }}
          editingItem={false}
          team={team ?? []}
        />
      </DialogContent>
    </Dialog>
  )
});