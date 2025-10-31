"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CreateWorkspace } from "../../../_components/utility-action-dashboard/create-workspace";

export function DialogCreateWorkspace({ isNoWorkspace = false }: { isNoWorkspace?: boolean }) {
  const [isOpen, setIsOpen] = useState<boolean>(isNoWorkspace);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">
        <div className="cursor-pointer border rounded-md hover:bg-accent">
          <div className="w-full flex items-center gap-2.5 py-2 px-4">
            <div>Nova Workspace</div>
            <Plus className="w-5 h-5 opacity-25 ml-auto" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="overflow-y-scroll max-h-[calc(100vh-6rem)]">
        <DialogHeader>
          <DialogTitle>Adicionar workspace</DialogTitle>
          <DialogDescription>
            Criar uma nova workspace, prossiga com os passos abaixo.
          </DialogDescription>
        </DialogHeader>
        <CreateWorkspace setClose={() => setIsOpen(!isOpen)} />
      </DialogContent>
    </Dialog>
  );
}
