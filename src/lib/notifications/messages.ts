
export const notificationMessages = {
  FRIEND_REQUEST: (senderName: string) =>
    `${senderName} enviou uma solicitação de amizade`,

  FRIEND_ACCEPTED: (friendName: string) =>
    `${friendName} aceitou seu pedido de amizade`,

  WORKSPACE_INVITE: (senderName: string, workspaceName: string) =>
    `${senderName} convidou você para "${workspaceName}"`,

  WORKSPACE_ACCEPTED: (userName: string, workspaceName: string) =>
    `${userName} aceitou o convite e entrou em "${workspaceName}"`,

  ITEM_COMPLETED: (userName: string, itemTitle: string) =>
    `${userName} concluiu a tarefa: "${itemTitle}"`,

  ITEM_ASSIGNED: (assignerName: string, itemTitle: string) =>
    `${assignerName} designou você para: "${itemTitle}"`,

  CHAT_MESSAGE: (senderName: string, preview?: string) =>
    preview
      ? `${senderName}: ${preview.slice(0, 50)}...`
      : `${senderName} enviou uma mensagem`,

  SISTEM_MESSAGE: (message: string) =>
    message, // Mensagem customizada do sistema

  NOTICES_MESSAGE: (title: string) =>
    title, // Título da notícia
} as const;