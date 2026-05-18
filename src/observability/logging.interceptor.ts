import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
@Injectable()
export class LoggingInterceptor implements NestInterceptor { private logger = new Logger('HTTP'); intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> { const req = context.switchToHttp().getRequest(); const started = Date.now(); return next.handle().pipe(tap(() => this.logger.log(JSON.stringify({ requestId: req.correlationId, method: req.method, path: req.url, userId: req.user?.id, durationMs: Date.now() - started })))); } }
