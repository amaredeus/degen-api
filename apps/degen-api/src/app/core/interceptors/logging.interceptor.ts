import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import * as microMemoize from 'micro-memoize';
import { MicroMemoize } from 'micro-memoize/dist/micro-memoize';

const memoize = microMemoize as MicroMemoize;

export interface LoggingInterceptorOptions {
  /**
   * Requested urls that match these strings/regexp will be ignore.
   * Results are memoized for performance.
   */
  ignoreRoutes?: (string | RegExp)[];
}

/** Logs all incoming http and graphql requests that pass guards */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  mergedOptions: LoggingInterceptorOptions;
  parsedIgnoreExpressions: RegExp[] = [];

  constructor(
    protected logger: Logger,
    protected loggingInterceptorOptions?: LoggingInterceptorOptions
  ) {
    this.mergedOptions = {
      ignoreRoutes: [],
      ...loggingInterceptorOptions,
    };
    this.parsedIgnoreExpressions = this.preParseRegExes(
      this.mergedOptions.ignoreRoutes
    );
  }

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const requestType: string = ctx.getType();

    // Logs GraphQL Requests
    if (requestType === 'graphql') {
      console.error('graphql logs not implemented yet...');
    }

    // Logs HTTP Requests
    else {
      const ctxHttp = ctx.switchToHttp();
      const req = ctxHttp.getRequest<Request>();
      if (
        req &&
        !this.anyUrlMatches(req.originalUrl || req.url, this.parsedIgnoreExpressions)
      ) {
        this.logger.log(this.getHttpLog(ctxHttp, req), req.method);
      }
    }

    return next.handle();
  }

  /** Override this method to declare your own log format or extend this one with a super call */
  getHttpLog(ctxHttp: HttpArgumentsHost, req: Request) {
    return {
      message: `[Request] ${req.method}: ${req.originalUrl || req.url}`,
      context: req.method,
      path: req.originalUrl || req.url,
      client: {
        host:
          req?.headers['x-forwarded-for'] || req?.ip || req?.connection?.remoteAddress,
        userAgent: req?.headers['user-agent'] || null,
      },
    };
  }

  /** Parses both strings and regExps to regExps */
  private preParseRegExes(ignoreUrls: (string | RegExp)[]): RegExp[] {
    return ignoreUrls.map((stringOrRegEx) => new RegExp(stringOrRegEx));
  }

  /** Checks if a given url passes the given configured ignore regExps. Results are memoized for performance. */
  private anyUrlMatches = memoize(
    (url: string, ignoreExpressions: RegExp[]): boolean => {
      for (let i = 0; i < ignoreExpressions.length; i++) {
        if (ignoreExpressions[i].test(url)) {
          return true;
        }
      }
      return false;
    },
    { maxSize: 100 }
  );
}
