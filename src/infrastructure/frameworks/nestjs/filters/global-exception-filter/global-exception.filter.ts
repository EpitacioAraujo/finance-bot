import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { Env } from '@/domain/entities/common/env';
import { BusinessError } from '@/domain/errors/BusinessError';
import { ProcessError } from '@/domain/errors/ProcessError';

import { ErrorResponseBuilder } from './error-response.builder';
import { ErrorHandlers } from './error-handlers';

/**
 * GlobalExceptionFilter
 *
 * Intercepta todas as exceções da aplicação e formata a resposta HTTP.
 *
 * Tratamento:
 * - BusinessError -> 4xx (erros de validação/negócio)
 * - ProcessError -> 5xx (erros de processamento/sistema)
 * - HttpException -> status code específico do NestJS
 * - Error -> 500 Internal Server Error
 * - Unknown -> 500 Internal Server Error
 *
 * Em ambientes de desenvolvimento/staging, inclui informações completas
 * de debug (stack trace, location, properties) na resposta HTTP.
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  private readonly isDevelopment: boolean;
  private readonly errorHandlers: ErrorHandlers;

  constructor() {
    this.isDevelopment = !Env.getInstance().isProduction();
    this.errorHandlers = new ErrorHandlers(this.logger, this.isDevelopment);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const result = this.handleException(exception, request.url);

    const builder = new ErrorResponseBuilder(
      request.url,
      request.method,
      this.isDevelopment,
    )
      .setStatus(result.status)
      .setErrorName(result.errorName)
      .setMessage(result.message)
      .setDetails(result.details);

    if (result.exception) {
      builder.setException(result.exception);
    }

    const errorResponse = builder.build();

    response.status(result.status).json(errorResponse);
  }

  private handleException(exception: unknown, requestUrl: string) {
    if (exception instanceof BusinessError) {
      return this.errorHandlers.handleBusinessError(exception, requestUrl);
    }

    if (exception instanceof ProcessError) {
      return this.errorHandlers.handleProcessError(exception, requestUrl);
    }

    if (exception instanceof HttpException) {
      return this.errorHandlers.handleHttpException(exception, requestUrl);
    }

    if (exception instanceof Error) {
      return this.errorHandlers.handleUnhandledError(exception, requestUrl);
    }

    return this.errorHandlers.handleUnknownException(exception, requestUrl);
  }
}
