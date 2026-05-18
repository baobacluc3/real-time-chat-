import { Controller, Get, Header } from '@nestjs/common';
import client from 'prom-client';
@Controller('metrics')
export class MetricsController { constructor() { client.collectDefaultMetrics({ prefix: 'messaging_' }); } @Get() @Header('Content-Type', client.register.contentType) metrics() { return client.register.metrics(); } }
