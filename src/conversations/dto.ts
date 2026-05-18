import { ArrayMinSize, IsArray, IsOptional, IsString, MinLength } from 'class-validator';
export class DirectConversationDto { @IsString() peerUserId!: string; }
export class GroupConversationDto { @IsString() @MinLength(1) title!: string; @IsArray() @ArrayMinSize(1) memberIds!: string[]; }
export class AddMemberDto { @IsString() userId!: string; @IsOptional() @IsString() role?: 'ADMIN' | 'MEMBER'; }
