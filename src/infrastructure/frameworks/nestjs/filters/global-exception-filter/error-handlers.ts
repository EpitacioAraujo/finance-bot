import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BusinessError } from '@/domain/errors/BusinessError';
import { ProcessError } from '@/domain/errors/ProcessError';

export interface ErrorHandlerResult {
  status: number;
  errorName: string;
  message: string;
  details?: any;
  exception?: Error;
}

/**
 * Handlers para diferentes tipos de erro
 */
export class ErrorHandlers {
  constructor(
    private readonly logger: Logger,
    private readonly isDevelopment: boolean,
  ) {}

  /**
   * Trata erros de negócio (BusinessError)
   */
  handleBusinessError(
    exception: BusinessError,
    requestUrl: string,
  ): ErrorHandlerResult {
    this.logger.warn(
      `BusinessError: ${exception.message} | Path: ${requestUrl}`,
      exception.stack,
    );

    return {
      status: exception.statusCode,
      errorName: exception.name,
      message: exception.message,
      details: exception.details,
      exception,
    };
  }

  /**
   * Trata erros de processamento (ProcessError)
   */
  handleProcessError(
    exception: ProcessError,
    requestUrl: string,
  ): ErrorHandlerResult {
    this.logger.error(
      `ProcessError: ${exception.message} | Path: ${requestUrl}`,
      exception.stack,
    );

    return {
      status: exception.statusCode,
      errorName: this.isDevelopment ? exception.name : 'InternalServerError',
      message: this.isDevelopment
        ? exception.message
        : 'Erro interno no sistema',
      details: this.isDevelopment ? exception.details : undefined,
      exception,
    };
  }

  /**
   * Trata exceções HTTP do NestJS
   */
  handleHttpException(
    exception: HttpException,
    requestUrl: string,
  ): ErrorHandlerResult {
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || exception.message;

    const details =
      typeof exceptionResponse === 'object' ? exceptionResponse : undefined;

    this.logger.warn(
      `HttpException: ${message} | Status: ${status} | Path: ${requestUrl}`,
    );

    return {
      status,
      errorName: exception.name,
      message,
      details,
      exception,
    };
  }

  /**
   * Trata erros não capturados (Error genérico)
   */
  handleUnhandledError(
    exception: Error,
    requestUrl: string,
  ): ErrorHandlerResult {
    this.logger.error(
      `Unhandled Error: ${exception.message} | Path: ${requestUrl}`,
      exception.stack,
    );

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorName: this.isDevelopment ? exception.name : 'InternalServerError',
      message: this.isDevelopment
        ? exception.message
        : 'Erro interno no sistema',
      exception,
    };
  }

  /**
   * Trata exceções desconhecidas
   */
  handleUnknownException(
    exception: unknown,
    requestUrl: string,
  ): ErrorHandlerResult {
    this.logger.error(`Unknown Exception | Path: ${requestUrl}`, exception);

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errorName: this.isDevelopment ? 'UnknownError' : 'InternalServerError',
      message: this.isDevelopment
        ? 'Erro desconhecido'
        : 'Erro interno no sistema',
    };
  }
}
