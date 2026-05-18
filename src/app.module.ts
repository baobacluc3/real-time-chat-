import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ConversationsModule } from './conversations/conversations.module';
import { PrismaModule } from './database/prisma.module';
import { MessagesModule } from './messages/messages.module';
import { ObservabilityModule } from './observability/observability.module';
import { CorrelationIdInterceptor } from './observability/correlation-id.interceptor';
import { LoggingInterceptor } from './observability/logging.interceptor';
import { PresenceModule } from './presence/presence.module';
import { RateLimitModule } from './rate-limit/rate-limit.module';
import { RealtimeModule } from './realtime/realtime.module';
import { RedisModule } from './redis/redis.module';
import { ReceiptsModule } from './receipts/receipts.module';
import { SearchModule } from './search/search.module';
import { UsersModule } from './users/users.module';
@Module({ imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot(), ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]), PrismaModule, RedisModule, AuthModule, UsersModule, ConversationsModule, MessagesModule, RealtimeModule, PresenceModule, ReceiptsModule, SearchModule, ObservabilityModule, RateLimitModule], providers: [{ provide: APP_INTERCEPTOR, useClass: CorrelationIdInterceptor }, { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor }] })
export class AppModule {}
