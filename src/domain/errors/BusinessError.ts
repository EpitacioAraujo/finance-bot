/**
 * BusinessError
 *
 * Representa erros relacionados a regras de negócio e validações.
 * Esses erros serão tratados com status HTTP 4xx.
 *
 * Exemplos:
 * - Validação de dados
 * - Regras de negócio não atendidas
 * - Recursos não encontrados
 * - Permissões insuficientes
 */
export class BusinessError extends Error {
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 400, details?: any) {
    super(message);
    this.name = 'BusinessError';
    this.statusCode = statusCode;
    this.details = details;

    // Mantém o stack trace correto
    Object.setPrototypeOf(this, BusinessError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
