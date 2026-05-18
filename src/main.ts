import 'reflect-metadata';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RedisIoAdapter } from './realtime/redis-io.adapter';
import { startTracing, otelSdk } from './tracing';
async function bootstrap() { await startTracing(); const app = await NestFactory.create(AppModule, { bufferLogs: true }); app.use(helmet()); app.enableCors({ origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000'], credentials: true }); app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })); const adapter = new RedisIoAdapter(app); await adapter.connectToRedis().catch((err) => Logger.warn(`Redis adapter disabled: ${err.message}`)); app.useWebSocketAdapter(adapter); app.enableShutdownHooks(); process.on('SIGTERM', async () => { await otelSdk.shutdown().catch(() => undefined); await app.close(); }); await app.listen(process.env.PORT ?? 3000); Logger.log(`Messaging API listening on ${await app.getUrl()}`); }
bootstrap();
