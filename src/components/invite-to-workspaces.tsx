"use client"

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { getMyWorkspaces } from "@/app/data-access/workspace";
import { addWorkspaceMember } from "@/app/actions/workspace";
import { unwrapServerData } from "@/utils/server-helpers";

interface InviteToWorkspaceProps {
  userId: string;
  setClose: (value: boolean) => void;
}

type Workspaces = {
  id: string;
  title: string;
  groupsCount: number;
  itemsCount: number;
  members: {
    name: string | null;
    id: string;
    image: string | null;
    email: string;
  }[];
}

export function InviteToWorkspace({ userId, setClose }: InviteToWorkspaceProps) {
  const [workspaces, setWorkspaces] = useState<Workspaces[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspaces>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const get = async () => {
      try {
        setIsLoading(true);
        const workspaces = await getMyWorkspaces().then(unwrapServerData);
        const filterWorkspaces = workspaces.filter(workspace =>
          !workspace.members.some(member => member.id === userId)
        );
        setWorkspaces(filterWorkspaces);
      } catch (error) {
        console.error("Erro ao carregar Workspaces:", error);
      } finally {
        setIsLoading(false);
      }
    }
    get();
  }, [userId]);

  const select = (Workspace: Workspaces) => {
    setSelectedWorkspace(Workspace);
  }
  const clear = () => {
    setSelectedWorkspace(undefined);
  }

  const handleSendInvite = async () => {
    if (!selectedWorkspace) return;
    try {
      setIsLoading(true);
      await addWorkspaceMember({
        workspaceId: selectedWorkspace.id,
        invitationUsersId: [userId],
        revalidatePaths: ["/dashboard/frends"]
      });
    } finally {
      setClose(false);
      setIsLoading(false);
      clear();
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Enviar convite</DialogTitle>
        <DialogDescription>
          Selecione a área de trabalho para enviar o convite
        </DialogDescription>
      </DialogHeader>

      {isLoading ? (
        <p className="text-center text-muted-foreground">Carregando...</p>
      ) : workspaces.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Nenhuma área de trabalho disponível
        </p>
      ) : (
        <ul className="overflow-y-scroll max-h-96">
          {workspaces.map((workspace, index) => (
            <li
              key={workspace.id}
              className={cn(
                "w-full flex items-center gap-2 cursor-pointer hover:bg-primary/20 border-b p-2 transition-colors",
                index === 0 && "border-t",
                selectedWorkspace?.id === workspace.id && "bg-primary/20"
              )}
              onClick={() => select(workspace)}
            >
              <p className="font-medium">{workspace.title}</p>
              <span className="ml-auto text-sm text-muted-foreground">
                {workspace.members.length} {workspace.members.length === 1 ? "membro" : "membros"}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between gap-1">
        <Button
          onClick={handleSendInvite}
          disabled={!selectedWorkspace || isLoading}
          className="cursor-pointer flex-1"
        >
          {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "Enviar convite"}
        </Button>
        {selectedWorkspace && !isLoading && (
          <Button
            onClick={clear}
            disabled={!selectedWorkspace || isLoading}
            className="cursor-pointer"
          >
            Limpar Seleção
          </Button>
        )}
      </div>
    </DialogContent>
  )
}