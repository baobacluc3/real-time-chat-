import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { ServerOptions } from 'socket.io';
import { RedisService } from '../redis/redis.service';
export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor?: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);
  constructor(private app: INestApplicationContext) { super(app); }
  async connectToRedis() { const redis = this.app.get(RedisService); const pub = redis.duplicate(); const sub = redis.duplicate(); await Promise.all([pub.connect(), sub.connect()]); this.adapterConstructor = createAdapter(pub, sub); this.logger.log('Socket.IO Redis adapter enabled for horizontal fan-out'); }
  createIOServer(port: number, options?: ServerOptions) { const server = super.createIOServer(port, options); if (this.adapterConstructor) server.adapter(this.adapterConstructor); return server; }
}
