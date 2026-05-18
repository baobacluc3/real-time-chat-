import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { trace } from '@opentelemetry/api';
import { PrismaService } from '../database/prisma.service';
import { RealtimePublisher } from './realtime.publisher';
@Injectable()
export class OutboxProcessor { private readonly logger = new Logger(OutboxProcessor.name); constructor(private prisma: PrismaService, private publisher: RealtimePublisher) {}
  @Cron(CronExpression.EVERY_5_SECONDS)
  async process() { return trace.getTracer('messaging').startActiveSpan('outbox.retry', async (span) => { try { const events = await this.prisma.outboxEvent.findMany({ where: { status: { in: ['PENDING', 'FAILED'] }, nextAttemptAt: { lte: new Date() } }, orderBy: { createdAt: 'asc' }, take: 50 }); for (const event of events) { try { if (event.conversationId) this.publisher.publishConversation(event.conversationId, event.eventName, event.payload); await this.prisma.outboxEvent.update({ where: { id: event.id }, data: { status: 'PUBLISHED', publishedAt: new Date(), lastError: null } }); } catch (err: any) { await this.prisma.outboxEvent.update({ where: { id: event.id }, data: { status: 'FAILED', attempts: { increment: 1 }, lastError: err.message, nextAttemptAt: new Date(Date.now() + 15000) } }); } } return events.length; } finally { span.end(); } }); }
}
