import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  readonly client: Redis;
  readonly subscriber: Redis;
  constructor(config: ConfigService) {
    const url = config.get<string>('REDIS_URL', 'redis://localhost:6379');
    this.client = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 3 });
    this.subscriber = new Redis(url, { lazyConnect: true, maxRetriesPerRequest: 3 });
    this.client.on('error', (err) => this.logger.warn(`Redis client error: ${err.message}`));
    this.subscriber.on('error', (err) => this.logger.warn(`Redis subscriber error: ${err.message}`));
  }
  duplicate() { return this.client.duplicate(); }
  async onModuleDestroy() { await Promise.allSettled([this.client.quit(), this.subscriber.quit()]); }
}
