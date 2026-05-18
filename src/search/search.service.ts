import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConversationsService } from '../conversations/conversations.service';
@Injectable()
export class SearchService { constructor(private prisma: PrismaService, private conversations: ConversationsService) {}
  async messages(userId: string, q: string, conversationId?: string) { if (conversationId) await this.conversations.assertMember(conversationId, userId); return this.prisma.message.findMany({ where: { body: { contains: q, mode: 'insensitive' }, deletedAt: null, ...(conversationId ? { conversationId } : { conversation: { members: { some: { userId, leftAt: null } } } }) }, take: 50, orderBy: { createdAt: 'desc' } }); }
}
