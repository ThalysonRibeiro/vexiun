/**
 * Erro de autenticação
 */
export class AuthenticationError extends Error {
  constructor(message = "Não autenticado") {
    super(message);
    this.name = "AuthenticationError";
  }
}

/**
 * Erro de permissão
 */
export class PermissionError extends Error {
  constructor(message = "Você não tem permissão para esta ação") {
    super(message);
    this.name = "PermissionError";
  }
}

/**
 * Erro de recurso não encontrado
 */
export class NotFoundError extends Error {
  constructor(resource: string = "Registro") {
    super(`${resource} não encontrado`);
    this.name = "NotFoundError";
  }
}

/**
 * Erro de validação de dados
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Erro de duplicação (unique constraint)
 */
export class DuplicateError extends Error {
  constructor(message = "Já existe um registro com esses dados") {
    super(message);
    this.name = "DuplicateError";
  }
}

/**
 * Erro de relacionamento inválido
 */
export class RelationError extends Error {
  constructor(message = "Relacionamento inválido") {
    super(message);
    this.name = "RelationError";
  }
}