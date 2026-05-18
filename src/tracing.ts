import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
export const otelSdk = new NodeSDK({ traceExporter: new OTLPTraceExporter({ url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT }), instrumentations: [getNodeAutoInstrumentations()] });
export async function startTracing() { if (process.env.OTEL_ENABLED !== 'false') await otelSdk.start(); }
