import { Injectable, TooManyRequestsException } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
@Injectable()
export class RateLimitService { constructor(private redis: RedisService) {}
  async check(key: string, limit: number, windowSeconds: number) { const count = await this.redis.client.incr(`rate:${key}`); if (count === 1) await this.redis.client.expire(`rate:${key}`, windowSeconds); if (count > limit) throw new TooManyRequestsException('rate limit exceeded'); return count; }
}
