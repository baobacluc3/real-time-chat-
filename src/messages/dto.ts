import { IsOptional, IsString, MinLength } from 'class-validator';
export class SendMessageDto { @IsString() @MinLength(1) body!: string; @IsOptional() @IsString() idempotencyKey?: string; }
export class EditMessageDto { @IsString() @MinLength(1) body!: string; }
export class ReadConversationDto { @IsString() messageId!: string; }
