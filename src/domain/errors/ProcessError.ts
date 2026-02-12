/**
 * ProcessError
 *
 * Representa erros relacionados a falhas no processamento da aplicação.
 * Esses erros serão tratados com status HTTP 5xx.
 *
 * Exemplos:
 * - Falhas de conexão com banco de dados
 * - Erros em serviços externos
 * - Falhas inesperadas no processamento
 * - Timeout em operações
 */
export class ProcessError extends Error {
  public readonly statusCode: number;
  public readonly details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = 'ProcessError';
    this.statusCode = statusCode;
    this.details = details;

    // Mantém o stack trace correto
    Object.setPrototypeOf(this, ProcessError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
