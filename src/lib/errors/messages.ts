export const ERROR_MESSAGES = {
  // Autenticação
  AUTH: {
    NOT_AUTHENTICATED: "Você precisa estar logado",
    SESSION_EXPIRED: "Sua sessão expirou",
    INVALID_CREDENTIALS: "Credenciais inválidas"
  },

  // Permissões
  PERMISSION: {
    NO_ACCESS: "Você não tem acesso a este recurso",
    INSUFFICIENT_ROLE: "Você não tem permissão para esta ação",
    OWNER_ONLY: "Apenas o proprietário pode realizar esta ação",
    ADMIN_ONLY: "Apenas administradores podem realizar esta ação"
  },

  // Status de entidades
  STATUS: {
    WORKSPACE_INACTIVE: "Workspace inativo",
    GROUP_INACTIVE: "Grupo inativo ou deletado",
    ITEM_INACTIVE: "Item inativo ou deletado",
    ALREADY_DELETED: "Este recurso já foi deletado",
    ALREADY_ACTIVE: "Este recurso já está ativo"
  },

  // Não encontrado
  NOT_FOUND: {
    WORKSPACE: "Workspace não encontrado",
    GROUP: "Grupo não encontrado",
    ITEM: "Item não encontrado",
    GOAL: "Meta não encontrada",
    USER: "Usuário não encontrado",
    INVITATION: "Convite não encontrado",
    NOTIFICATION: "Notificação não encontrada"
  },

  // Validação
  VALIDATION: {
    REQUIRED_FIELD: "Este campo é obrigatório",
    INVALID_FORMAT: "Formato inválido",
    INVALID_EMAIL: "Email inválido",
    INVALID_ID: "ID inválido",
    MIN_LENGTH: "Valor muito curto",
    MAX_LENGTH: "Valor muito longo"
  },

  // Duplicação
  DUPLICATE: {
    EMAIL: "Este email já está cadastrado",
    MEMBER: "Este usuário já é membro",
    MEMBERS: "Todos os usuários já são membros ou já têm convite pendente",
    INVITATION: "Já existe um convite pendente para este usuário",
    WORKSPACE_NAME: "Já existe um workspace com este nome"
  },

  // Regras de negócio
  BUSINESS: {
    CANNOT_DELETE_SELF: "Você não pode deletar a si mesmo",
    CANNOT_CHANGE_OWN_ROLE: "Você não pode alterar seu próprio cargo",
    WORKSPACE_HAS_MEMBERS: "Não é possível deletar workspace com membros",
    INVITATION_ALREADY_PROCESSED: "Este convite já foi processado",
    INVITATION_EXPIRED: "Este convite expirou"
  },

  // Solicitações (convites, etc)
  REQUESTS: {
    ALREADY_SENT: "Você já enviou uma solicitação para este usuário",
    ALREADY_RECEIVED: "Esse usuário já enviou uma solicitação para você",
    ALREADY_ACCEPTED: "Você já aceitou essa solicitação",
    ALREADY_REJECTED: "Você já rejeitou essa solicitação",
    INVALID_STATUS: "Status inválido",
    INVALID_TYPE: "Tipo inválido",
    CANNOT_SEND_TO_SELF: "Você não pode enviar solicitação para si mesmo",
    EXPIRED: "Este convite expirou"
  },

  PASSWORD: {
    MIN: "A senha deve ter no mínimo 8 caracteres",
    MAX: "A senha deve ter no máximo 100 caracteres",
    UPPERCASE: "A senha deve conter pelo menos uma letra maiúscula",
    LOWERCASE: "A senha deve conter pelo menos uma letra minúscula",
    NUMBER: "A senha deve conter pelo menos um número",
    SPECIAL: "A senha deve conter pelo menos um caractere especial"
  },

  // Operações CRUD
  WORKSPACE: {
    CREATE_ERROR: "Erro ao criar workspace",
    UPDATE_ERROR: "Erro ao atualizar workspace",
    DELETE_ERROR: "Erro ao deletar workspace"
  },

  ITEM: {
    CREATE_ERROR: "Erro ao criar item",
    UPDATE_ERROR: "Erro ao atualizar item",
    DELETE_ERROR: "Erro ao deletar item"
  },

  // Genéricos
  GENERIC: {
    UNKNOWN_ERROR: "Algo deu errado. Tente novamente",
    SERVER_ERROR: "Erro interno do servidor"
  }
} as const;
