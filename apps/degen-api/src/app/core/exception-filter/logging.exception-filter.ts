import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  HttpServer,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request } from 'express';

export interface LoggingFilterExceptions {
  /** Skip logging GraphQL errors if you expect apollo to log them */
  skipGraphQLErrors: boolean;
}

/** Alternative Global NestJS exception filter that logs all errors */
@Catch()
export class LoggingExceptionFilter extends BaseExceptionFilter {
  constructor(
    protected readonly logger: Logger,
    protected readonly applicationRef: HttpServer,
    protected readonly loggingFilterOptions?: LoggingFilterExceptions
  ) {
    super(applicationRef);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const requestType: string = host.getType();
    // Logs Http Errors
    if (requestType === 'http' && exception instanceof HttpException) {
      const ctxHttp = host.switchToHttp();
      const req = ctxHttp.getRequest<Request>();
      this.logger.error(
        this.getHttpErrorLog(ctxHttp, req, exception),
        exception.stack,
        req.method
      );
      return super.catch(exception, host);
    }
    // Log other external exceptions
    else if (
      exception instanceof Error &&
      !this.loggingFilterOptions?.skipGraphQLErrors
    ) {
      this.logger.error(
        {
          message: exception.message,
          stack: exception.stack,
        },
        'Request'
      );
    }
    throw exception;
  }

  /** Override this method to declare your own log format or extend this one with a super call */
  getHttpErrorLog(ctxHttp: HttpArgumentsHost, req: Request, exception: unknown) {
    let status;
    if (exception instanceof HttpException) {
      status = exception.getStatus();
    }
    return {
      message: `[Error] ${req.method}: ${req.originalUrl || req.url}`,
      error: exception['message'] ?? '',
      status: status,
      context: req.method,
      path: req.originalUrl || req.url,
      client: {
        host:
          req?.headers['x-forwarded-for'] || req?.ip || req?.connection?.remoteAddress,
        userAgent: req?.headers['user-agent'] || null,
      },
    };
  }
}
