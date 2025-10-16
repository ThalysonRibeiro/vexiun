import {
  BroadcastNotificationType,
  deleteAllNotifications,
  deleteMultipleNotifications,
  DeleteMultipleNotificationsType,
  deleteNotification,
  DeleteNotificationType,
  deleteReadNotifications,
  markAllAsRead,
  markNotificationAsRead,
  MarkNotificationAsReadType,
  sendBroadcastNotification,
  smartCleanup
} from "@/app/actions/notification";
import { Notification } from "@/generated/prisma";
import { isSuccessResponse } from "@/utils/error-handler";
import { ERROR_MESSAGES } from "@/utils/error-messages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { toast } from "sonner";


export function useNotifications() {
  const previousNotifications = useRef<Notification[]>([]);
  const isFirstFetch = useRef(true);

  const query = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch("/api/notifications");
      if (!response.ok) {
        throw new Error(ERROR_MESSAGES.NOT_FOUND.NOTIFICATION);
      }
      return response.json();
    },

    refetchInterval: (query) => {
      if (typeof document === 'undefined') return false;
      if (document.visibilityState === 'hidden') return false;
      return 30 * 1000; // 30 segundos
    },

    refetchOnWindowFocus: true,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (!query.data || query.data.length === 0) return;

    if (isFirstFetch.current) {
      previousNotifications.current = query.data;
      isFirstFetch.current = false;
      return;
    }

    const previousIds = previousNotifications.current.map(n => n.id);
    const newNotifications = query.data.filter(
      notification => !previousIds.includes(notification.id)
    );

    if (newNotifications.length > 0) {
      const sortedNew = [...newNotifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      sortedNew.slice(0, 3).forEach((notification, index) => {
        setTimeout(() => {
          showNotificationToast(notification);
        }, index * 300);
      });

      if (sortedNew.length > 3) {
        setTimeout(() => {
          toast.info(`+ ${sortedNew.length - 3} novas notificações`);
        }, 900);
      }
    }

    previousNotifications.current = query.data;
  }, [query.data]);

  return query;
}

export function useUnreadNotificationsCount() {
  const { data: notifications } = useNotifications();
  return notifications?.length || 0;
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: MarkNotificationAsReadType) => {
      const result = await markNotificationAsRead(data);
      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", variables.notificationId] });
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await markAllAsRead();
      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteNotificationType) => {
      const result = await deleteNotification(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await deleteAllNotifications();

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useDeleteMultipleNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteMultipleNotificationsType) => {
      const result = await deleteMultipleNotifications(data);

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["notifications", variables.notificationIds] });
    },
  });
}

export function useDeleteReadNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await deleteReadNotifications();

      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useSmartCleanup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const result = await smartCleanup();
      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useSendBroadcastNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BroadcastNotificationType) => {
      const result = await sendBroadcastNotification(data);
      if (!isSuccessResponse(result)) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

function showNotificationToast(notification: Notification) {
  const { type } = notification;

  const profileTypes = [
    "CHAT_MESSAGE",
    "WORKSPACE_INVITE",
    "WORKSPACE_ACCEPTED",
    "ITEM_ASSIGNED",
    "ITEM_COMPLETED"
  ];

  if (profileTypes.includes(type)) {
    toast.custom((t) => (
      <div
        className="flex items-start gap-3 bg-card p-4 rounded-lg shadow-lg border min-w-[300px] max-w-md animate-in slide-in-from-right cursor-pointer hover:shadow-xl transition-shadow"
        onClick={() => toast.dismiss(t)}
      >
        <div className="relative">
          <Image
            src={notification.image || "/default-avatar.png"}
            alt={notification.nameReference || "Usuário"}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <span className="absolute -bottom-1 -right-1 text-sm bg-background rounded-full w-5 h-5 flex items-center justify-center border border-border">
            {getNotificationEmoji(type)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground">
            {notification.nameReference || "Usuário"}
          </p>

          <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
            {getTruncatedMessage(notification)}
          </p>

          <p className="text-xs text-muted-foreground/70 mt-1">
            {getTimeAgo(notification.createdAt)}
          </p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(t);
          }}
          className="text-muted-foreground/50 hover:text-muted-foreground flex-shrink-0 transition-colors"
        >
          ✕
        </button>
      </div>
    ), {
      duration: 5000,
      position: 'top-right',
    });
  } else {
    const emoji = getNotificationEmoji(type);
    toast(`${emoji} ${notification.message}`, {
      duration: 4000,
    });
  }
}

function getTruncatedMessage(notification: Notification): string {
  const maxLength = 60;

  switch (notification.type) {
    case "CHAT_MESSAGE":
      const message = notification.message || "Enviou uma mensagem";
      return message.length > maxLength
        ? `${message.substring(0, maxLength)}...`
        : message;
    case "WORKSPACE_INVITE":
      return "Convidou você para uma workspace";
    case "WORKSPACE_ACCEPTED":
      return "Aceitou o convite da workspace";
    case "ITEM_ASSIGNED":
      return "Atribuiu um item para você";
    case "ITEM_COMPLETED":
      return "Completou um item";
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
    WORKSPACE_INVITE: "💻",
    WORKSPACE_ACCEPTED: "🎉",
    ITEM_ASSIGNED: "📦",
    ITEM_COMPLETED: "✔️",
    CHAT_MESSAGE: "💬",
    SISTEM_MESSAGE: "📢",
    NOTICES_MESSAGE: "🔔",
  };

  return emojis[type] || "🔔";
}