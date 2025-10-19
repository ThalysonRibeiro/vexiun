"use client"
import { Badge } from "@/components/ui/badge";
import { WorkspaceRole } from "@/generated/prisma";
import { Crown, Shield, Users, Eye } from "lucide-react";

interface BadgeWorkspaceProps {
  role: WorkspaceRole;
  className?: string;
}

export function BadgeWorkspace({ role, className = "" }: BadgeWorkspaceProps) {
  const badges = {
    OWNER: {
      icon: Crown,
      label: "Owner",
      className: "bg-amber-500 text-white hover:bg-amber-600"
    },
    ADMIN: {
      icon: Shield,
      label: "Admin",
      className: "bg-blue-500 text-white hover:bg-blue-600"
    },
    MEMBER: {
      icon: Users,
      label: "Membro",
      className: "bg-gray-500 text-white hover:bg-gray-600"
    },
    VIEWER: {
      icon: Eye,
      label: "Visualizador",
      className: "bg-gray-400 text-white hover:bg-gray-500"
    }
  } as const;

  const badge = badges[role];
  if (!badge) return null;

  const Icon = badge.icon;

  return (
    <Badge className={`gap-1 ${badge.className} ${className}`}>
      <Icon className="w-3 h-3" />
      {badge.label}
    </Badge>
  );
}

const roleLabels: Record<WorkspaceRole, string> = {
  OWNER: "Proprietário",
  ADMIN: "Administrador",
  MEMBER: "Membro",
  VIEWER: "Visualizador"
};

export function RoleLabel({ role }: { role: WorkspaceRole }) {
  const label = roleLabels[role];
  if (!label) return null;

  return;
}