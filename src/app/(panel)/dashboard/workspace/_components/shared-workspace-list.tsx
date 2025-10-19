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
import { WorkspacesMenberWithWorkspace } from "./workspaces-page-client";

interface WorkspaceListProps {
  sharedWorkspaces: WorkspacesMenberWithWorkspace[];
}

export function SharedWorkspaceList({ sharedWorkspaces }: WorkspaceListProps) {
  const router = useRouter();
  if (sharedWorkspaces.length === 0) {
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
          <TableHead className="border-l">Titulo</TableHead>
          <TableHead className="text-center border-x">Equipe</TableHead>
          <TableHead className="text-center w-0 border-l">Role</TableHead>
          <TableHead className="text-center border-l w-0">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sharedWorkspaces.map((shared, index) => (
          <TableRow key={shared.workspaceId} className="table-row">
            <TableCell className="font-medium border-l">{shared.workspace.title}</TableCell>

            <TableCell className=" border-l">
              <div className="flex items-center">
                {shared.workspace.members.slice(0, 6).map((member, index) => (
                  <Avatar key={index}>
                    <AvatarImage src={member.user.image as string} />
                    <AvatarFallback>
                      {member.user.name?.charAt(0) ?? "N"}
                    </AvatarFallback>
                  </Avatar>
                ))}
                {shared.workspace._count.members >= 6 && (
                  <span className="ml-2 flex gap-1">
                    +{shared.workspace.members.slice(6).length}
                  </span>
                )}
              </div>
            </TableCell>

            <TableCell className="border-x">
              {shared.role && (
                <BadgeWorkspace role={shared.role} />
              )}
            </TableCell>

            <TableCell>
              <Button
                variant={"outline"}
                onClick={() => router.push(`/dashboard/workspace/${shared.workspaceId}`)}>
                <Link /> ir para workspace
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}