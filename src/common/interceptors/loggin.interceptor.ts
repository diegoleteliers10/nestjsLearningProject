import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, body } = request;
    const startTime = Date.now();

    // 📝 Log de entrada
    this.logger.log(
      `🔄 ${method} ${url} - Body: ${JSON.stringify(body)}`
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const { statusCode } = response;
        
        // 📝 Log de salida
        this.logger.log(
          `✅ ${method} ${url} - ${statusCode} - ${duration}ms`
        );
      }),
    );
  }
}