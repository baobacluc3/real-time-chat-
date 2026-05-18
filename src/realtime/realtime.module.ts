import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { ConversationsModule } from '../conversations/conversations.module';
import { MessagesModule } from '../messages/messages.module';
import { PresenceModule } from '../presence/presence.module';
import { RateLimitModule } from '../rate-limit/rate-limit.module';
import { OutboxProcessor } from './outbox.processor';
import { RealtimeGateway } from './realtime.gateway';
import { RealtimePublisher } from './realtime.publisher';
@Module({ imports: [AuthModule, ConversationsModule, MessagesModule, PresenceModule, RateLimitModule], providers: [RealtimeGateway, RealtimePublisher, OutboxProcessor], exports: [RealtimePublisher, OutboxProcessor] })
export class RealtimeModule {}
