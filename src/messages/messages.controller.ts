import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { EditMessageDto, ReadConversationDto, SendMessageDto } from './dto';
import { MessagesService } from './messages.service';
@UseGuards(JwtAuthGuard)
@Controller()
export class MessagesController { constructor(private messages: MessagesService) {}
  @Get('conversations/:conversationId/messages') list(@Req() req: any, @Param('conversationId') conversationId: string, @Query('cursor') cursor?: string, @Query('limit') limit?: string) { return this.messages.list(conversationId, req.user.id, cursor, Number(limit ?? 30)); }
  @Post('conversations/:conversationId/messages') send(@Req() req: any, @Param('conversationId') conversationId: string, @Body() dto: SendMessageDto) { return this.messages.send(conversationId, req.user.id, dto.body, dto.idempotencyKey); }
  @Patch('messages/:id') edit(@Req() req: any, @Param('id') id: string, @Body() dto: EditMessageDto) { return this.messages.edit(id, req.user.id, dto.body); }
  @Delete('messages/:id') delete(@Req() req: any, @Param('id') id: string) { return this.messages.delete(id, req.user.id); }
  @Post('conversations/:conversationId/read') read(@Req() req: any, @Param('conversationId') conversationId: string, @Body() dto: ReadConversationDto) { return this.messages.read(conversationId, req.user.id, dto.messageId); }
}
