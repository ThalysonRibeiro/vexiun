'use client'
import {
  useDeleteAllNotifications,
  useDeleteMultipleNotifications,
  useDeleteNotification,
  useDeleteReadNotifications,
  useMarkAllAsRead,
  useMarkNotificationAsRead,
  useNotifications,
  useSmartCleanup
} from '@/hooks/use-notifications';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCheck, X, Sparkles, Check, Bell, Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';
import { isSuccessResponse } from '@/utils/error-handler';

export default function NotificationsPage() {
  const { data: notifications = [], refetch } = useNotifications();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteAllNotifications = useDeleteAllNotifications();
  const deleteMultipleNotifications = useDeleteMultipleNotifications();
  const deleteReadNotifications = useDeleteReadNotifications();
  const deleteNotification = useDeleteNotification();
  const markAllAsRead = useMarkAllAsRead();
  const markNotificationAsRead = useMarkNotificationAsRead();
  const smartCleanup = useSmartCleanup();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    const result = await deleteNotification.mutateAsync({ notificationId: id });

    if (!isSuccessResponse(result)) {
      toast.error("Erro ao deletar notificação");
    }
    refetch();
    setIsDeleting(false);
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;

    setIsDeleting(true);
    const result = await deleteMultipleNotifications.mutateAsync({ notificationIds: selectedIds });

    if (!isSuccessResponse(result)) {
      toast.error("Erro ao deletar notificações");
    }
    toast.success(`${selectedIds.length} notificações deletadas`);
    setSelectedIds([]);
    refetch();
    setIsDeleting(false);
  };

  const handleDeleteAll = async () => {
    if (!confirm('Deseja realmente deletar todas as notificações?')) return;

    setIsDeleting(true);
    const result = await deleteAllNotifications.mutateAsync();

    if (!isSuccessResponse(result)) {
      toast.error("Error ao deletar notificações");
      setIsDeleting(false);
    }
    toast.success(`${result.data} notificações deletadas`);
    refetch();
    setIsDeleting(false);
  };

  const handleDeleteRead = async () => {
    setIsDeleting(true);
    const result = await deleteReadNotifications.mutateAsync();

    if (!isSuccessResponse(result)) {
      toast.error("Erro ao deletar notificações");
    }
    toast.success(`${result.data} notificações lidas deletadas`);
    refetch();
    setIsDeleting(false);
  };

  const handleSmartCleanup = async () => {
    setIsDeleting(true);
    const result = await smartCleanup.mutateAsync();

    if (!isSuccessResponse(result)) {
      toast.error("Erro ao limpar notificações");
    }
    const { data } = result;
    toast(
      <div>
        <div>✅ Limpeza concluída!</div>
        <div>{data?.deleted?.total} notificações removidas.</div>
        <div>{data?.deleted?.isRead} lidas antigas,</div>
        <div>{data?.deleted?.unread} não lidas antigas,</div>
        <div>{data?.deleted?.old} excedentes</div>
      </div>
    );
    refetch();
    setIsDeleting(false);
  };

  const handleMarkAllRead = async () => {
    setIsDeleting(true);
    const result = await markAllAsRead.mutateAsync();

    if (isSuccessResponse(result)) {
      toast.error("Error ao marcar notificações como lidas");
    }
    refetch();

    setIsDeleting(false);
  };

  const handleMarkAsRead = async (id: string) => {
    const result = await markNotificationAsRead.mutateAsync({ notificationId: id });
    if (!isSuccessResponse(result)) {
      toast.error("Erro ao marcar como lida");
    }
    refetch();;
  };

  return (
    <main className="container mx-auto p-6 max-w-4xl mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notificações</h1>
          <p className="text-sm text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} não lidas` : 'Todas lidas'}
          </p>
        </div>

        <div className="flex gap-2 flex-wrap justify-end">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={isDeleting}
            >
              <Check className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </Button>
          )}

          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDeleteSelected}
              disabled={isDeleting}
            >
              <Trash className="w-4 h-4 mr-2" />
              Deletar ({selectedIds.length})
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteRead}
            disabled={isDeleting}
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Deletar Lidas
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSmartCleanup}
            disabled={isDeleting}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Limpeza Inteligente
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteAll}
            disabled={isDeleting}
          >
            <X className="w-4 h-4 mr-2" />
            Deletar Todas
          </Button>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={selectedIds.length === notifications.length}
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm font-medium">
              {selectedIds.length === notifications.length
                ? 'Desselecionar todas'
                : 'Selecionar todas'}
            </span>
          </label>
        </div>
      )}

      <div className="space-y-2">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhuma notificação</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 p-4 border rounded-lg transition-colors ${!notification.isRead ? 'bg-accent/50 border-accent' : 'hover:bg-muted/50'
                }`}
            >
              <Checkbox
                checked={selectedIds.includes(notification.id)}
                onCheckedChange={() => handleToggleSelect(notification.id)}
              />

              <div
                className="flex-1 cursor-pointer"
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{notification.message}</p>
                  {!notification.isRead && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(notification.createdAt), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(notification.id)}
                disabled={isDeleting}
              >
                <Trash className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}