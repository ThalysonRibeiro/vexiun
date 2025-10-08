import { NotificationType } from "@/generated/prisma";

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

export const statusMap = {
  DONE: "CONCLUÍDO",
  IN_PROGRESS: "EM ANDAMENTO",
  STOPPED: "INTERROMPIDO",
  NOT_STARTED: "NÃO INICIADO",
}

export const statusKeys = ["DONE", "IN_PROGRESS", "STOPPED", "NOT_STARTED"];

export function colorPriority(status: string): string {
  switch (status) {
    case "CRITICAL":
      return "bg-red-500 dark:bg-red-500 text-white";
    case "HIGH":
      return "bg-orange-500 dark:bg-orange-500 text-white";
    case "MEDIUM":
      return "bg-yellow-500 dark:bg-yellow-500 text-white";
    case "LOW":
      return "bg-green-500 dark:bg-green-500 text-white";
    default:
      return "bg-zinc-400 dark:bg-zinc-400 text-white";
  }
}
export function borderColorPriority(status: string): string {
  switch (status) {
    case "CRITICAL":
      return "border-red-500 dark:border-red-500";
    case "HIGH":
      return "border-orange-500 dark:border-orange-500";
    case "MEDIUM":
      return "border-yellow-500 dark:border-yellow-500";
    case "LOW":
      return "border-green-500 dark:border-green-500";
    default:
      return "border-zinc-400 dark:border-zinc-400";
  }
}

export const priorityMap = {
  CRITICAL: "CRÍTICO",
  HIGH: "ALTO",
  MEDIUM: "MÉDIO",
  LOW: "BAIXO",
  STANDARD: "PADRÃO",
}

export const priorityKeys = ["CRITICAL", "HIGH", "MEDIUM", "LOW", "STANDARD"];


export const notificationMap = {
  FRIEND_REQUEST: "PEDIDO DE AMIZADE",
  FRIEND_ACCEPTED: "AMIZADE ACEITA",
  WORKSPACE_INVITE: "CONVITE DE PROJETO",
  WORKSPACE_ACCEPTED: "CONVITE ACEITO",
  ITEM_ASSIGNED: "ITEM ATRIBUÍDO",
  ITEM_COMPLETED: "ITEM CONCLUÍDO",
  CHAT_MESSAGE: "MENSAGEM DE BATE-PAPO",
  SISTEM_MESSAGE: "MENSAGEM DO SISTEMA",
  NOTICES_MESSAGE: "NOTÍCIAS",
};

export const notificationColor = (notification: NotificationType) => {
  switch (notification) {
    case "FRIEND_REQUEST":
      return "border border-blue-400 text-blue-400";
    case "FRIEND_ACCEPTED":
      return "border border-green-400 text-green-400";
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
}