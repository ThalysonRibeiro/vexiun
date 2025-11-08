"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Folder, MessageCirclePlus, User } from "lucide-react";
import UtilityButton, { UtilityButtonItem } from "../../../../../components/ui/utility-button";
import { ComponentType, ReactNode, useState } from "react";
import { ChatMessage } from "./chat-message";
import { CreateWorkspace } from "./create-workspace";

type DialogType = "project" | "chat";

interface DialogConfig {
  type: DialogType;
  title: string;
  description?: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  delay: 0 | 75 | 150;
  renderContent: (closeDialog: () => void) => ReactNode;
}

const DIALOGS: DialogConfig[] = [
  {
    type: "project",
    title: "Criar workspace",
    icon: Folder,
    label: "Criar workspace",
    delay: 75,
    renderContent: (closeDialog) => <CreateWorkspace setClose={closeDialog} />
  },
  {
    type: "chat",
    title: "Chat",
    icon: MessageCirclePlus,
    label: "Chat",
    delay: 150,
    renderContent: () => <ChatMessage />
  }
];

export function UtilityContent() {
  const [openDialog, setOpenDialog] = useState<DialogType | null>(null);

  const handleCloseDialog = () => setOpenDialog(null);

  return (
    <>
      <UtilityButton>
        {DIALOGS.map(({ type, icon: Icon, label, delay }) => (
          <UtilityButtonItem
            key={type}
            delay={delay}
            onClick={() => setOpenDialog(type)}
            icon={<Icon className="w-4 h-4 mr-3" />}
          >
            {label}
          </UtilityButtonItem>
        ))}
      </UtilityButton>

      {DIALOGS.map(({ type, title, description, renderContent }) => (
        <Dialog
          key={type}
          open={openDialog === type}
          onOpenChange={(open) => setOpenDialog(open ? type : null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && <DialogDescription>{description}</DialogDescription>}
            </DialogHeader>
            {renderContent(handleCloseDialog)}
          </DialogContent>
        </Dialog>
      ))}
    </>
  );
}
