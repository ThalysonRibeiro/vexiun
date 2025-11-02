"use client";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { memo } from "react";
import { InvitesWithWorkspaceAndInviter } from "../types";

interface InvitesContentProps {
  pendingInvites: InvitesWithWorkspaceAndInviter[];
  onAccept: (inviteId: string, workspaceId: string) => void;
  onDecline: (inviteId: string, workspaceId: string) => void;
  loadingMap: Record<string, boolean>;
}

export const PendingInvites = memo(function PendingInvites(props: InvitesContentProps) {
  const { pendingInvites, loadingMap, onAccept, onDecline } = props;
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Convites</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Workspace</TableHead>
            <TableHead>Convidado por</TableHead>
            <TableHead className="text-right pr-15">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingInvites.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-sm text-muted-foreground">
                Nenhum convite pendente.
              </TableCell>
            </TableRow>
          ) : (
            pendingInvites.map((invite) => (
              <TableRow key={invite.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {invite.workspace?.title ?? "Workspace sem nome"}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={invite.inviter?.image ?? undefined}
                        alt={invite.inviter?.name ?? "Usuário"}
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {invite.inviter?.name?.charAt(0).toUpperCase() ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm">{invite.inviter?.name ?? "-"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      onClick={() => onAccept(invite.id, invite.workspaceId)}
                      disabled={!!loadingMap[invite.id]}
                    >
                      {loadingMap[invite.id] ? "..." : "Aceitar"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDecline(invite.id, invite.workspaceId)}
                      disabled={!!loadingMap[invite.id]}
                    >
                      {loadingMap[invite.id] ? "..." : "Recusar"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
        <TableCaption>Convites pendentes recebidos</TableCaption>
      </Table>
    </section>
  );
});
