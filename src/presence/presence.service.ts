import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
@Injectable()
export class PresenceService { constructor(private redis: RedisService) {}
  private ttl = 45;
  async connect(userId: string, socketId: string) { await this.redis.client.sadd(`user:${userId}:sockets`, socketId); await this.heartbeat(userId); await this.redis.client.set(`socket:${socketId}:user`, userId, 'EX', this.ttl); }
  async disconnect(userId: string, socketId: string) { await this.redis.client.srem(`user:${userId}:sockets`, socketId); await this.redis.client.del(`socket:${socketId}:user`); const count = await this.redis.client.scard(`user:${userId}:sockets`); if (count === 0) await this.redis.client.del(`presence:${userId}`); }
  async heartbeat(userId: string) { await this.redis.client.set(`presence:${userId}`, 'online', 'EX', this.ttl); return { userId, status: 'online', expiresIn: this.ttl }; }
  async isOnline(userId: string) { return (await this.redis.client.exists(`presence:${userId}`)) === 1; }
}
