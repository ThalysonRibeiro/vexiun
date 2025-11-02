"use client";

import { memo, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
} from "@/components/ui/table";
import { SentInvite } from "../types";

interface InvitesContentProps {
  sentInvites?: SentInvite[] | null;
  loadingMap: Record<string, boolean>;
  selected: Record<string, boolean>;
  toggleSelect: (id: string) => void;
  selectAllInGroup: (group: SentInvite[]) => void;
  unselectAllInGroup: (group: SentInvite[]) => void;
  onCancel: (inviteId: Array<string>) => void;
}

export const SentInvites = memo(function SentInvites(props: InvitesContentProps) {
  const {
    sentInvites,
    loadingMap,
    onCancel,
    selectAllInGroup,
    unselectAllInGroup,
    selected,
    toggleSelect
  } = props;

  const groupedSent = useMemo(() => {
    if (!sentInvites) {
      return [] as Array<{
        workspace: { id?: string; title?: string } | null;
        invites: SentInvite[];
      }>;
    }
    const map = sentInvites.reduce((m, invite) => {
      const wsId = invite.workspace?.id ?? "unknown";
      if (!m.has(wsId)) {
        m.set(wsId, { workspace: invite.workspace, invites: [] as SentInvite[] });
      }
      m.get(wsId)!.invites.push(invite);
      return m;
    }, new Map<string, { workspace: { id?: string; title?: string } | null; invites: SentInvite[] }>());
    return Array.from(map.values());
  }, [sentInvites]);

  return (
    <>
      {sentInvites && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Convites enviados</h2>

          {sentInvites.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum convite enviado.</p>
          ) : (
            groupedSent.map((group) => (
              <div key={group.workspace?.id ?? Math.random()} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">
                    {group.workspace?.title ?? "Workspace sem nome"}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const anyNotSelected = group.invites.some((i) => !selected[i.id]);
                        if (anyNotSelected) selectAllInGroup(group.invites);
                        else unselectAllInGroup(group.invites);
                      }}
                    >
                      {group.invites.some((i) => !selected[i.id])
                        ? "Selecionar todos"
                        : "Desmarcar todos"}
                    </Button>
                    {group.invites.some((i) => selected[i.id]) && (
                      <Button
                        size="sm"
                        onClick={async () => {
                          const idsToCancel = group.invites
                            .map((i) => i.id)
                            .filter((id) => selected[id]);
                          onCancel(idsToCancel);
                        }}
                      >
                        Cancelar selecionados
                      </Button>
                    )}
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-6">
                        <span className="sr-only">Selecionar</span>
                        <Checkbox
                          onClick={() => {
                            const anyNotSelected = group.invites.some((i) => !selected[i.id]);
                            if (anyNotSelected) selectAllInGroup(group.invites);
                            else unselectAllInGroup(group.invites);
                          }}
                          checked={group.invites.every((i) => selected[i.id])}
                        />
                      </TableHead>
                      <TableHead>Nome / Email</TableHead>
                      <TableHead>Convidado por</TableHead>
                      <TableHead className="text-right pr-8">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {group.invites.map((invite) => (
                      <TableRow key={invite.id}>
                        <TableCell>
                          <Checkbox
                            checked={!!selected[invite.id]}
                            onCheckedChange={() => toggleSelect(invite.id)}
                          />
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={invite.user?.image ?? undefined}
                                alt={invite.user?.name ?? invite.user?.email ?? "Usuário"}
                              />
                              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {invite.user?.name?.charAt(0).toUpperCase() ?? "U"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {invite.user?.name ?? invite.user?.email}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {invite.user?.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <span className="text-sm">{invite.inviter?.name ?? "-"}</span>
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onCancel([invite.id])}
                              disabled={!!loadingMap[invite.id]}
                            >
                              {loadingMap[invite.id] ? "..." : "Cancelar"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableCaption>Convites enviados para este workspace</TableCaption>
                </Table>
              </div>
            ))
          )}
        </section>
      )}
    </>
  );
});
