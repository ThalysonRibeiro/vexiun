import { NotificationType } from "@/generated/prisma";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Circle,
  Loader2,
  Minus,
  PauseCircle
} from "lucide-react";

export function colorStatus(status: string): string {
  switch (status) {
    case "DONE":
      return "bg-green-500 dark:bg-green-500 text-white";
    case "IN_PROGRESS":
      return "bg-blue-500 dark:bg-blue-500 text-white";
    case "STOPPED":
      return "bg-red-500 dark:bg-red-500 text-white";
    default:
      return "bg-zinc-400 dark:bg-zinc-400 text-white";
  }
}
export function borderColorStatus(status: string): string {
  switch (status) {
    case "DONE":
      return "border-green-500 dark:border-green-500";
    case "IN_PROGRESS":
      return "border-blue-500 dark:border-blue-500";
    case "STOPPED":
      return "border-red-500 dark:border-red-500";
    default:
      return "border-zinc-400 dark:border-zinc-400";
  }
}

export const statusMap = [
  {
    key: "DONE",
    label: "CONCLUÍDO",
    icon: CheckCircle2,
    color: "text-green-600",
    animate: false
  },
  {
    key: "IN_PROGRESS",
    label: "EM ANDAMENTO",
    icon: Loader2,
    color: "text-blue-600",
    animate: true
  },
  {
    key: "STOPPED",
    label: "INTERROMPIDO",
    icon: PauseCircle,
    color: "text-orange-600",
    animate: false
  },
  {
    key: "NOT_STARTED",
    label: "NÃO INICIADO",
    icon: Circle,
    color: "text-gray-600",
    animate: false
  }
] as const;

export function colorPriority(status: string): string {
  switch (status) {
    case "CRITICAL":
      return "bg-zinc-700 dark:bg-zinc-700 text-white";
    case "HIGH":
      return "bg-red-700 dark:bg-red-700 text-white";
    case "MEDIUM":
      return "bg-red-500 dark:bg-red-500 text-white";
    case "LOW":
      return "bg-red-400 dark:bg-red-400 text-white";
    default:
      return "bg-zinc-400 dark:bg-zinc-400 text-white";
  }
}
export function borderColorPriority(status: string): string {
  switch (status) {
    case "CRITICAL":
      return "bg-zinc-700 dark:bg-zinc-700";
    case "HIGH":
      return "bg-red-700 dark:bg-red-7000";
    case "MEDIUM":
      return "bg-red-500 dark:bg-red-500";
    case "LOW":
      return "bg-red-400 dark:bg-red-400";
    default:
      return "bg-zinc-400 dark:bg-zinc-400";
  }
}

export const priorityMap = [
  { key: "CRITICAL", label: "CRÍTICO", icon: AlertCircle, color: "text-red-600" },
  { key: "HIGH", label: "ALTO", icon: ArrowUp, color: "text-orange-600" },
  { key: "MEDIUM", label: "MÉDIO", icon: Minus, color: "text-yellow-600" },
  { key: "LOW", label: "BAIXO", icon: ArrowDown, color: "text-green-600" },
  { key: "STANDARD", label: "PADRÃO", icon: Circle, color: "text-gray-600" }
];

export const notificationMap = {
  WORKSPACE_INVITE: "CONVITE DE PROJETO",
  WORKSPACE_ACCEPTED: "CONVITE ACEITO",
  ITEM_ASSIGNED: "ITEM ATRIBUÍDO",
  ITEM_COMPLETED: "ITEM CONCLUÍDO",
  CHAT_MESSAGE: "MENSAGEM DE BATE-PAPO",
  SISTEM_MESSAGE: "MENSAGEM DO SISTEMA",
  NOTICES_MESSAGE: "NOTÍCIAS"
};

export const notificationColor = (notification: NotificationType) => {
  switch (notification) {
    case "WORKSPACE_INVITE":
      return "border border-violet-400 text-violet-400";
    case "WORKSPACE_ACCEPTED":
      return "border border-green-400 text-green-400";
    case "ITEM_ASSIGNED":
      return "border border-orange-400 text-orange-400";
    case "ITEM_COMPLETED":
      return "border border-green-400 text-green-400";
    case "SISTEM_MESSAGE":
      return "border border-red-400 text-red-400";
    case "NOTICES_MESSAGE":
      return "border border-yellow-400 text-yellow-400";
    default:
      return "border border-zinc-400 text-zinc-400";
  }
};
