/**
 * Global Exception Filter
 *
 * Sistema de tratamento de exceções para a aplicação.
 *
 * @module GlobalExceptionFilter
 */

export { GlobalExceptionFilter } from './global-exception.filter';
export { ErrorResponseBuilder } from './error-response.builder';
export { ErrorHandlers } from './error-handlers';
export * from './stack-trace.utils';

export type { ErrorResponse, DebugInfo } from './error-response.builder';
export type { ErrorHandlerResult } from './error-handlers';
