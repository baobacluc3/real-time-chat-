import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { conversationRoom } from '../common/types';
@Injectable()
export class RealtimePublisher { server?: Server; publishConversation(conversationId: string, event: string, payload: unknown) { this.server?.to(conversationRoom(conversationId)).emit(event, payload); } }
