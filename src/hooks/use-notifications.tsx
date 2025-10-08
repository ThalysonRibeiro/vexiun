import { Notification } from "@/generated/prisma";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useNotifications() {
  const previousNotifications = useRef<Notification[]>([]);

  const query = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch("/api/notifications");
      if (!response.ok) {
        throw new Error("Erro ao buscar notificações");
      }
      return response.json();
    },
  });

  useEffect(() => {
    if (query.data && query.data.length > 0) {
      const previousIds = previousNotifications.current.map(n => n.id);
      const newNotifications = query.data.filter(
        notification => !previousIds.includes(notification.id)
      );

      if (newNotifications.length > 0) {
        const latest = newNotifications[0];
        showNotificationToast(latest);
      }

      previousNotifications.current = query.data;
    }
  }, [query.data]);

  return query;
}

function showNotificationToast(notification: Notification) {
  const { type } = notification;

  // Tipos que mostram perfil do usuário
  const profileTypes = [
    "FRIEND_REQUEST",
    "FRIEND_ACCEPTED",
    "CHAT_MESSAGE",
    "WORKSPACE_INVITE",
    "WORKSPACE_ACCEPTED",
    "ITEM_ASSIGNED",
    "ITEM_COMPLETED"
  ];

  if (profileTypes.includes(type)) {
    toast.custom(() => (
      <div className="flex items-start gap-3 bg-card p-4 rounded-lg shadow-lg border min-w-[300px]">
        <Image
          src={notification.image || "/default-avatar.png"}
          alt={notification.nameReference || "Usuário"}
          width={50}
          height={50}
          className="w-10 h-10 rounded-full object-cover flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
            {notification.nameReference || "Usuário"}
          </p>

          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-0.5">
            {getTruncatedMessage(notification)}
          </p>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            {getTimeAgo(notification.createdAt)}
          </p>
        </div>

        <span className="text-xl flex-shrink-0">
          {getNotificationEmoji(type)}
        </span>
      </div>
    ));
  } else {
    const emoji = getNotificationEmoji(type);
    toast(`${emoji} ${notification.message}`);
  }
}

function getTruncatedMessage(notification: Notification): string {
  const maxLength = 60;

  switch (notification.type) {
    case "FRIEND_REQUEST":
      return "Enviou uma solicitação de amizade";
    case "FRIEND_ACCEPTED":
      return "Aceitou sua solicitação de amizade";
    case "CHAT_MESSAGE":
      const message = notification.message || "Enviou uma mensagem";
      return message.length > maxLength
        ? `${message.substring(0, maxLength)}...`
        : message;
    default:
      return notification.message;
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const notificationDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

  if (diffInSeconds < 60) return "Agora";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m atrás`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h atrás`;
  return `${Math.floor(diffInSeconds / 86400)}d atrás`;
}

function getNotificationEmoji(type: string): string {
  const emojis: Record<string, string> = {
    FRIEND_REQUEST: "👥",
    FRIEND_ACCEPTED: "✅",
    WORKSPACE_INVITE: "💻",
    ITEM_ASSIGNED: "📦",
    CHAT_MESSAGE: "💬",
    SISTEM_MESSAGE: "📢",
    NOTICES_MESSAGE: "🔔",
  };

  return emojis[type] || "🔔";
}