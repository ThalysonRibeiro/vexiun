"use client"
import { Bell, Check, Settings, Trash, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, } from "@/lib/utils";
import { notificationColor, notificationMap } from "@/utils/colorStatus";
import { NotificationType } from "@/generated/prisma";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  useDeleteNotification,
  useMarkAllAsRead,
  useMarkNotificationAsRead,
  useNotifications
} from "@/hooks/use-notifications";
import { toast } from "sonner";
import { isSuccessResponse } from "@/lib/errors/error-handler";
import {
  useAcceptWorkspaceInvitation,
  useDeclineWorkspaceInvitation
} from "@/hooks/use-workspace";
import Link from "next/link";

export function NotificationContent() {
  const { data: notifications = [], refetch } = useNotifications();
  const acceptWorkspaceInvitation = useAcceptWorkspaceInvitation();
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const declineWorkspaceInvitation = useDeclineWorkspaceInvitation();
  const markAllAsRead = useMarkAllAsRead();
  const markNotificationAsRead = useMarkNotificationAsRead();
  const deleteNotification = useDeleteNotification();

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsRead.mutateAsync({ notificationId: id });
    if (!isSuccessResponse(result)) {
      toast.error("Erro ao marcar como lida");
    }
    refetch();
  };

  const handleMarkAllRead = async () => {
    const result = await markAllAsRead.mutateAsync();

    if (!isSuccessResponse(result)) {
      toast.error("Erro ao marcar todas como lidas");
    }
    refetch();
  };

  const handleDelete = async (id: string) => {
    const result = await deleteNotification.mutateAsync({ notificationId: id });
    if (!isSuccessResponse(result)) {
      toast.error("Erro ao deletar notificação");
    }
    refetch();

  };

  const handleAcceptWorkspaceInvite = async (workspaceId: string,) => {
    try {
      await acceptWorkspaceInvitation.mutateAsync({
        workspaceId,
        revalidatePaths: ["/dashboard"]
      });
    } catch (error) {
      toast.error("Falha ao aceitar convite");
    }
  }

  const handleDeclineWorkspaceInvitation = async (workspaceId: string) => {
    try {
      await declineWorkspaceInvitation.mutateAsync({ workspaceId });
    } catch (error) {
      toast.error("Falha ao rejeitar convite")
    }
  }
  const withoutAvatar = [
    "SISTEM_MESSAGE",
    "NOTICES_MESSAGE"
  ];
  const excludedTypes = [
    "SISTEM_MESSAGE",
    "NOTICES_MESSAGE",
    "WORKSPACE_ACCEPTED",
    "ITEM_COMPLETED",
    "ITEM_ASSIGNED"
  ];

  return (
    <div className="absolute top-4 right-16 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative cursor-pointer"
            aria-label={`Notificações: ${unreadCount} não lidas`}
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <div className={cn(
                "absolute -top-1.5 -right-2 bg-primary rounded-full",
                "w-5 h-5 flex items-center justify-center text-xs text-primary-foreground font-semibold",
              )}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-96 max-h-[500px] overflow-y-auto">
          <DropdownMenuLabel className="flex justify-between items-center">
            Notificações
            {unreadCount > 0 && (
              <Button
                variant="link"
                size="sm"
                className="text-zinc-500 hover:text-zinc-700 font-normal text-sm cursor-pointer ml-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkAllRead();
                }}
              >
                Marcar todas como lidas
              </Button>
            )}
            <Link href={"/dashboard/notifications"} className="text-zinc-500 hover:text-zinc-100">
              <Settings strokeWidth={1} className="w-5 h-5" />
            </Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {unreadCount === 0 ? (
            <div className="py-8 text-center text-zinc-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">Nenhuma notificação</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "relative mt-1 flex flex-col items-start gap-2 p-3",
                  "bg-zinc-50 dark:bg-background w-full min-h-20 rounded-md border cursor-pointer",
                  "hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group",
                  notification.isRead && "opacity-60"
                )}
                onSelect={(e) => e.preventDefault()}
                onClick={() => {
                  switch (notification.type) {
                    case "CHAT_MESSAGE":
                    case "WORKSPACE_INVITE":
                    case "ITEM_ASSIGNED":
                      break;
                    default:
                      handleMarkAsRead(notification.id)
                      break;
                  }
                }}
              >
                <span className={cn("absolute bottom-1 right-2 text-xs text-gray-500",
                )}>
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: ptBR
                  })}
                </span>
                {/* Badge de tipo */}
                <span className={cn(
                  "absolute top-2 right-2 rounded px-2 py-0.5 text-[11px] font-medium",
                  notificationColor(notification.type as NotificationType)
                )}>
                  {notificationMap[notification.type as keyof typeof notificationMap]}
                </span>

                {/* Avatar (se aplicável) */}
                {!notification.type === withoutAvatar.includes(notification.type as NotificationType) && (
                  <Avatar className="absolute top-2 left-2 w-6 h-6">
                    <AvatarImage src={notification.image as string} />
                    <AvatarFallback>{notification.nameReference?.split(" ")[0][0].toUpperCase()}</AvatarFallback>
                  </Avatar>
                )}

                {!notification.type === withoutAvatar.includes(notification.type as NotificationType) && (
                  <div className="text-sm font-medium -mb-6 ml-7 truncate max-w-45">
                    <span className="uppercase">{notification.nameReference?.slice(0, 1)}</span>
                    <span>{notification.nameReference?.slice(1)}</span>
                  </div>
                )}

                {/* Mensagem */}
                <p className={cn(
                  "text-sm mt-6 pr-16",
                  !notification.isRead && "italic"
                )}>
                  {notification.message}
                </p>

                {/* Ações */}
                <div className="flex items-center justify-between w-full mt-auto">
                  {!notification.isRead && (
                    <Button
                      variant="link"
                      size="sm"
                      className="h-auto p-0 text-xs font-normal cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                    >
                      Marcar como lida
                    </Button>
                  )}

                  <div>
                    {!excludedTypes.includes(notification.type) && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-green-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAcceptWorkspaceInvite(notification.referenceId as string,);
                            handleDelete(notification.id);
                          }}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-auto h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeclineWorkspaceInvitation(notification.referenceId as string);
                            handleDelete(notification.id);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}

                    {excludedTypes.includes(notification.type) && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500 hover:text-red-600 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>)}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}