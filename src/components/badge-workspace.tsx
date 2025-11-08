"use client";
import { Badge } from "@/components/ui/badge";
import { WorkspaceRole } from "@/generated/prisma";
import { Crown, Shield, Users, Eye } from "lucide-react";

interface BadgeWorkspaceProps {
  role: WorkspaceRole;
  className?: string;
}

export const badges = {
  OWNER: {
    icon: Crown,
    label: "Owner",
    className: "bg-amber-500 text-white"
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

export function BadgeWorkspace({ role, className = "" }: BadgeWorkspaceProps) {
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

  return label;
}

export const roleBadgesMap = [
  {
    key: "OWNER",
    icon: Crown,
    label: "Owner",
    className: "bg-amber-500 text-white hover:bg-amber-600"
  },
  {
    key: "ADMIN",
    icon: Shield,
    label: "Admin",
    className: "bg-blue-500 text-white hover:bg-blue-600"
  },
  {
    key: "MEMBER",
    icon: Users,
    label: "Membro",
    className: "bg-gray-500 text-white hover:bg-gray-600"
  },
  {
    key: "VIEWER",
    icon: Eye,
    label: "Visualizador",
    className: "bg-gray-400 text-white hover:bg-gray-500"
  }
] as const;

export function roleColor(role: WorkspaceRole) {
  switch (role) {
    case "OWNER":
      return "bg-amber-500 dark:bg-amber-500 text-white hover:bg-amber-600";
    case "ADMIN":
      return "bg-blue-500 dark:bg-blue-500 text-white hover:bg-blue-600";
    case "MEMBER":
      return "bg-gray-500 dark:bg-gray-500 text-white hover:bg-gray-600";
    default:
      return "bg-gray-400 dark:bg-gray-400 text-white hover:bg-amber-600";
  }
}
