"use client";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BadgeWorkspace, roleBadgesMap, roleColor } from "@/components/badge-workspace";
import { cn } from "@/lib/utils";
import { WorkspaceRole } from "@/generated/prisma";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { memo } from "react";
import { TeamResponse } from "@/hooks/use-team";
import { ActionTeam } from "./action-team";
import { roleDescriptions } from "@/lib/constants";

interface ListMembersProps {
  workspaceId: string;
  team: TeamResponse | undefined;
  onRoleChange: (
    memberId: string,
    currentRole: WorkspaceRole,
    newRole: WorkspaceRole
  ) => Promise<void>;
  onRemoveMember: (memberId: string) => Promise<void>;
  onRedirect: (value: string) => void;
}

export const ListMembers = memo(function ListMembers(props: ListMembersProps) {
  const { workspaceId, team, onRemoveMember, onRoleChange, onRedirect } = props;

  return (
    <Table className="border">
      <TableCaption>
        <p className="text-sm text-muted-foreground">Uma lista dos membros do seu workspace.</p>
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {team?.map((member) => (
          <TableRow key={member.user.id}>
            <TableCell className="py-0.5">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={member.user.image ?? undefined}
                    alt={member.user.name ?? "Usuário"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {member.user.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>{member.user.name}</div>
              </div>
            </TableCell>
            <TableCell className="py-0.5">{member.user.email}</TableCell>

            <TableCell className="py-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  {member.role === "OWNER" ? (
                    <div className="inline-block">
                      <BadgeWorkspace role={member.role} />
                    </div>
                  ) : (
                    <Select
                      value={member.role}
                      onValueChange={(value: WorkspaceRole) =>
                        onRoleChange(member.user.id, member.role, value)
                      }
                    >
                      <SelectTrigger
                        size="sm"
                        className={cn(
                          "w-[140px] text-xs font-medium border-0 shadow-none focus:ring-1 cursor-pointer",
                          roleColor(member.role)
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="p-2">
                        {roleBadgesMap
                          .filter((badge) => badge.key !== "OWNER")
                          .map((badge) => {
                            const Icon = badge.icon;
                            return (
                              <SelectItem
                                key={badge.key}
                                value={badge.key}
                                className={cn("cursor-pointer mb-1", badge.className)}
                              >
                                <div className="flex items-center gap-2">
                                  <Icon className="w-3 h-3 text-white" />
                                  <span>{badge.label}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  )}
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p className="text-xs">{roleDescriptions[member.role]}</p>
                </TooltipContent>
              </Tooltip>
            </TableCell>

            <TableCell className="text-right py-0.5">
              <ActionTeam
                workspaceId={workspaceId}
                memberId={member.user.id}
                memberRole={member.role}
                onRemoveMember={onRemoveMember}
                onRedirect={onRedirect}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
});
