import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Observable } from 'rxjs';
@Injectable()
export class CorrelationIdInterceptor implements NestInterceptor { intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> { const req = context.switchToHttp().getRequest(); const res = context.switchToHttp().getResponse(); const id = req.headers['x-request-id'] ?? randomUUID(); req.correlationId = id; res?.setHeader?.('x-request-id', id); return next.handle(); } }
