import { Prisma } from "@/generated/prisma";
import {
  AuthenticationError,
  PermissionError,
  NotFoundError,
  ValidationError,
  DuplicateError,
  RelationError
} from "./custom-errors";

/**
 * Tipo de retorno de erro padronizado
 */
export interface ErrorResponse {
  error: string;
  code?: string;
}

/**
 * Tipo de retorno de sucesso padronizado
 */
export interface SuccessResponse<T = unknown> {
  success: true;
  message?: string;
  data?: T;
}

/**
 * Tipo de retorno genérico
 */
export type ActionResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

/**
 * Mapeia códigos de erro do Prisma para mensagens amigáveis
 */
function handlePrismaError(error: Prisma.PrismaClientKnownRequestError): ErrorResponse {
  switch (error.code) {
    case "P2002": {
      // Unique constraint violation
      const field = (error.meta?.target as string[])?.[0] || "campo";
      return {
        error: `Já existe um registro com este ${field}`,
        code: "DUPLICATE"
      };
    }
    case "P2025": {
      // Record not found
      return {
        error: "Registro não encontrado",
        code: "NOT_FOUND"
      };
    }
    case "P2003": {
      // Foreign key constraint violation
      return {
        error: "Relacionamento inválido ou registro relacionado não existe",
        code: "RELATION_ERROR"
      };
    }
    case "P2014": {
      // Required relation violation
      return {
        error: "Violação de relacionamento obrigatório",
        code: "RELATION_ERROR"
      };
    }
    case "P2021": {
      // Table does not exist
      return {
        error: "Erro de configuração do banco de dados",
        code: "DATABASE_ERROR"
      };
    }
    case "P2022": {
      // Column does not exist
      return {
        error: "Erro de configuração do banco de dados",
        code: "DATABASE_ERROR"
      };
    }
    default:
      return {
        error: "Erro no banco de dados",
        code: "DATABASE_ERROR"
      };
  }
}

/**
 * Handler principal de erros
 *
 * @param error - Erro capturado
 * @param defaultMessage - Mensagem padrão caso não seja possível identificar
 * @param context - Contexto adicional para logging (opcional)
 * @returns Objeto com erro formatado
 */
export function handleError(
  error: unknown,
  defaultMessage: string = "Erro ao processar operação",
  context?: Record<string, unknown>
): ErrorResponse {
  // Suprime log de PermissionError (comum quando recursos são deletados durante navegação)
  const shouldLog = !(error instanceof PermissionError);

  // Log detalhado no servidor (não envia para o cliente)
  if (shouldLog) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${defaultMessage}:`, {
      error,
      context,
      stack: error instanceof Error ? error.stack : undefined
    });
  }

  // Erros customizados
  if (error instanceof AuthenticationError) {
    return { error: error.message, code: "AUTH_ERROR" };
  }

  if (error instanceof PermissionError) {
    return { error: error.message, code: "PERMISSION_ERROR" };
  }

  if (error instanceof NotFoundError) {
    return { error: error.message, code: "NOT_FOUND" };
  }

  if (error instanceof ValidationError) {
    return { error: error.message, code: "VALIDATION_ERROR" };
  }

  if (error instanceof DuplicateError) {
    return { error: error.message, code: "DUPLICATE" };
  }

  if (error instanceof RelationError) {
    return { error: error.message, code: "RELATION_ERROR" };
  }

  // Erros do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return {
      error: "Dados inválidos fornecidos",
      code: "VALIDATION_ERROR"
    };
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return {
      error: "Erro ao conectar ao banco de dados",
      code: "DATABASE_CONNECTION_ERROR"
    };
  }

  // Erros padrão do JavaScript
  if (error instanceof Error) {
    // Em produção, não expor detalhes internos
    if (process.env.NODE_ENV === "production") {
      return { error: defaultMessage, code: "GENERIC_ERROR" };
    }
    return { error: error.message, code: "ERROR" };
  }

  // Erro desconhecido
  return { error: defaultMessage, code: "UNKNOWN_ERROR" };
}

/**
 * Helper para criar resposta de sucesso padronizada
 */
export function successResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message && { message })
  };
}

/**
 * Wrapper para try/catch em actions
 * 
 * Uso:
 * ```typescript
 * export const myAction = withErrorHandler(
 *   async (data) => {
 *     // lógica da action
 *     return { success: true, data: result };
 *   },
 *   "Falha ao executar ação"
 * );

 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withErrorHandler<TArgs extends any[], TReturn>(
  handler: (...args: TArgs) => Promise<ActionResponse<TReturn>>,
  defaultMessage?: string
): (...args: TArgs) => Promise<ActionResponse<TReturn>> {
  return async (...args: TArgs) => {
    try {
      return await handler(...args);
    } catch (error) {
      return handleError(error, defaultMessage);
    }
  };
}

/**
 * Helper para criar resposta de erro padronizada
 */
export function errorResponse(message: string, code?: string): ErrorResponse {
  return {
    error: message,
    ...(code && { code })
  };
}

/**
 * Type guard para verificar se é uma resposta de erro
 */
export function isErrorResponse(response: ActionResponse): response is ErrorResponse {
  return "error" in response;
}

/**
 * Type guard para verificar se é uma resposta de sucesso
 */
export function isSuccessResponse<T>(response: ActionResponse<T>): response is SuccessResponse<T> {
  return "success" in response && response.success === true;
}
