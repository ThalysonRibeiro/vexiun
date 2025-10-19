"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Edit2, Inbox, Link, Trash } from "lucide-react";
import { Prisma, WorkspaceRole } from "@/generated/prisma";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeWorkspace } from "@/components/badge-workspace";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { WorkspaceForm } from "./workspace-form";
import { useState } from "react";

interface WorkspaceListProps {
  workspaces: Array<{
    id: string;
    title: string;
    groupsCount: number;
    itemsCount: number;
    members: Array<{
      name: string | null;
      image: string | null;
      id: string;
      email: string;
    }>;
    menbersRole: WorkspaceRole | undefined;
  }>;
  onDelete: (id: string) => void;
}

export function WorkspaceList({ workspaces, onDelete, }: WorkspaceListProps) {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string | null>(null);
  const router = useRouter();
  if (workspaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Inbox className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold">Nenhuma workspace encontrada</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Comece criando uma nova workspace
        </p>
      </div>
    );
  }

  return (

    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center border-l">Titulo</TableHead>
          <TableHead className="text-center w-0 border-x">Total de grupos</TableHead>
          <TableHead className="text-center w-0">Total de items</TableHead>
          <TableHead className="text-center border-x">Equipe</TableHead>
          <TableHead className="text-center w-0 border-l">Role</TableHead>
          <TableHead className="text-center border-l w-0">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {workspaces.map((workspace, index) => (
          <TableRow key={workspace.id} className="table-row">
            <TableCell className="font-medium border-l">{workspace.title}</TableCell>
            <TableCell className="border-x">{workspace.groupsCount}</TableCell>
            <TableCell>{workspace.itemsCount}</TableCell>
            <TableCell className=" border-l">
              <div className="flex items-center">
                {workspace.members.slice(0, 6).map(member => (
                  <Avatar key={member.id}>
                    <AvatarImage src={member.image as string} />
                    <AvatarFallback>
                      {member.name?.charAt(0) ?? "N"}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {workspace.members.length >= 6 && (
                  <span className="ml-2 flex gap-1">
                    +{workspace.members.slice(6).length}
                  </span>
                )}
              </div>
            </TableCell>

            <TableCell className="border-x">
              {workspace.menbersRole && (
                <BadgeWorkspace role={workspace.menbersRole} />
              )}
            </TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button
                  variant={"outline"}
                  onClick={() => router.push(`/dashboard/workspace/${workspace?.id}`)}>
                  <Link /> ir para workspace
                </Button>


                <Dialog key={workspace.id}>
                  <DialogTrigger asChild>
                    <Button
                      variant={"outline"}
                      size={"icon"}
                      onClick={() => setSelectedWorkspace(workspace?.id)}>
                      <Edit2 />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Editar Workspace
                      </DialogTitle>
                      <DialogDescription>
                        Editar Workspace {workspace.title}
                      </DialogDescription>
                    </DialogHeader>
                    <WorkspaceForm
                      workspaceId={selectedWorkspace ?? ""}
                      initialValues={{ title: workspace.title }}
                    />
                  </DialogContent>
                </Dialog>

                <Button
                  variant={"outline"}
                  size={"icon"}
                  onClick={() => onDelete(workspace?.id)}>
                  <Trash />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}