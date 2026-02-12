import {
  extractErrorLocation,
  extractErrorProperties,
} from './stack-trace.utils';

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path?: string;
  method?: string;
  error?: string;
  message: string;
  details?: any;
  debug?: DebugInfo;
}

export interface DebugInfo {
  stack?: string;
  name: string;
  originalMessage: string;
  cause?: any;
  location?: string;
  properties?: Record<string, any>;
}

/**
 * Builder para construir respostas de erro padronizadas
 */
export class ErrorResponseBuilder {
  private statusCode: number;
  private errorName: string;
  private message: string;
  private details?: any;
  private path: string;
  private method: string;
  private isDevelopment: boolean;
  private exception?: Error;

  constructor(path: string, method: string, isDevelopment: boolean) {
    this.path = path;
    this.method = method;
    this.isDevelopment = isDevelopment;
  }

  setStatus(statusCode: number): this {
    this.statusCode = statusCode;
    return this;
  }

  setErrorName(errorName: string): this {
    this.errorName = errorName;
    return this;
  }

  setMessage(message: string): this {
    this.message = message;
    return this;
  }

  setDetails(details: any): this {
    this.details = details;
    return this;
  }

  setException(exception: Error): this {
    this.exception = exception;
    return this;
  }

  build(): ErrorResponse {
    const errorResponse: ErrorResponse = {
      statusCode: this.statusCode,
      timestamp: new Date().toISOString(),
      message: this.message,
    };

    // Adiciona path e method apenas em desenvolvimento/staging
    if (this.isDevelopment) {
      errorResponse.path = this.path;
      errorResponse.method = this.method;
    }

    // Adiciona nome do erro apenas em desenvolvimento/staging
    if (this.isDevelopment) {
      errorResponse.error = this.errorName;
    }

    // Adiciona details apenas em desenvolvimento/staging
    if (this.isDevelopment && this.details) {
      errorResponse.details = this.details;
    }

    // Adiciona informações de debug apenas em desenvolvimento/staging
    if (this.isDevelopment && this.exception) {
      errorResponse.debug = this.buildDebugInfo(this.exception);
    }

    return errorResponse;
  }

  private buildDebugInfo(exception: Error): DebugInfo {
    const debugInfo: DebugInfo = {
      stack: exception.stack,
      name: exception.name,
      originalMessage: exception.message,
    };

    if (exception.cause) {
      debugInfo.cause = exception.cause;
    }

    const location = extractErrorLocation(exception.stack);
    if (location) {
      debugInfo.location = location;
    }

    const properties = extractErrorProperties(exception);
    if (properties) {
      debugInfo.properties = properties;
    }

    return debugInfo;
  }
}
