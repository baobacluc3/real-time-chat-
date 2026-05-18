import { Logger } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { conversationRoom, userRoom } from '../common/types';
import { ConversationsService } from '../conversations/conversations.service';
import { MessagesService } from '../messages/messages.service';
import { PresenceService } from '../presence/presence.service';
import { RateLimitService } from '../rate-limit/rate-limit.service';
import { RealtimePublisher } from './realtime.publisher';
@WebSocketGateway({ cors: { origin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000'], credentials: true } })
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server!: Server; private readonly logger = new Logger(RealtimeGateway.name);
  constructor(private auth: AuthService, private conversations: ConversationsService, private messages: MessagesService, private presence: PresenceService, private rateLimit: RateLimitService, private publisher: RealtimePublisher) {}
  afterInit(server: Server) { this.publisher.server = server; }
  async handleConnection(client: Socket) { try { const token = this.extractToken(client); if (!token) throw new Error('missing token'); const payload = this.auth.verifySocketToken(token); client.data.user = { id: payload.sub, email: payload.email, username: payload.username, displayName: payload.displayName }; await client.join(userRoom(payload.sub)); const memberships = await this.conversations.memberConversationIds(payload.sub); await Promise.all(memberships.map((m) => client.join(conversationRoom(m.conversationId)))); await this.presence.connect(payload.sub, client.id); this.server.to(userRoom(payload.sub)).emit('presence:update', { userId: payload.sub, status: 'online' }); } catch (err: any) { this.logger.warn(`Rejected socket ${client.id}: ${err.message}`); client.emit('error', { code: 'UNAUTHORIZED', message: 'invalid websocket token' }); client.disconnect(true); } }
  async handleDisconnect(client: Socket) { const user = client.data.user; if (user) await this.presence.disconnect(user.id, client.id); }
  extractToken(client: Socket) { const authToken = client.handshake.auth?.token as string | undefined; const header = client.handshake.headers.authorization; const bearer = Array.isArray(header) ? header[0] : header; return authToken ?? bearer?.replace(/^Bearer /i, ''); }
  @SubscribeMessage('message:send') async send(@ConnectedSocket() client: Socket, @MessageBody() body: any) { const user = client.data.user; await this.rateLimit.check(`ws:send:${user.id}`, 30, 60); const message = await this.messages.send(body.conversationId, user.id, body.body, body.idempotencyKey); this.server.to(conversationRoom(body.conversationId)).emit('message:new', message); return { ok: true, message }; }
  @SubscribeMessage('message:ack') async ack(@ConnectedSocket() client: Socket, @MessageBody() body: any) { const delivery = await this.messages.ack(body.messageId, client.data.user.id); this.server.to(conversationRoom(body.conversationId)).emit('message:delivered', delivery); return { ok: true }; }
  @SubscribeMessage('message:edit') async edit(@ConnectedSocket() client: Socket, @MessageBody() body: any) { const message = await this.messages.edit(body.messageId, client.data.user.id, body.body); this.server.to(conversationRoom(message.conversationId)).emit('message:updated', message); return { ok: true, message }; }
  @SubscribeMessage('message:delete') async del(@ConnectedSocket() client: Socket, @MessageBody() body: any) { const message = await this.messages.delete(body.messageId, client.data.user.id); this.server.to(conversationRoom(message.conversationId)).emit('message:deleted', { id: message.id, conversationId: message.conversationId }); return { ok: true }; }
  @SubscribeMessage('typing:start') async typingStart(@ConnectedSocket() client: Socket, @MessageBody() body: any) { await this.rateLimit.check(`ws:typing:${client.data.user.id}`, 120, 60); client.to(conversationRoom(body.conversationId)).emit('typing:update', { userId: client.data.user.id, conversationId: body.conversationId, typing: true }); }
  @SubscribeMessage('typing:stop') typingStop(@ConnectedSocket() client: Socket, @MessageBody() body: any) { client.to(conversationRoom(body.conversationId)).emit('typing:update', { userId: client.data.user.id, conversationId: body.conversationId, typing: false }); }
  @SubscribeMessage('conversation:join') async join(@ConnectedSocket() client: Socket, @MessageBody() body: any) { await this.conversations.assertMember(body.conversationId, client.data.user.id); await client.join(conversationRoom(body.conversationId)); return { ok: true }; }
  @SubscribeMessage('conversation:read') async read(@ConnectedSocket() client: Socket, @MessageBody() body: any) { const receipt = await this.messages.read(body.conversationId, client.data.user.id, body.messageId); this.server.to(conversationRoom(body.conversationId)).emit('message:read', receipt); return { ok: true }; }
  @SubscribeMessage('presence:heartbeat') heartbeat(@ConnectedSocket() client: Socket) { return this.presence.heartbeat(client.data.user.id); }
}
