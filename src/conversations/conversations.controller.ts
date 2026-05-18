import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AddMemberDto, DirectConversationDto, GroupConversationDto } from './dto';
import { ConversationsService } from './conversations.service';
@UseGuards(JwtAuthGuard) @Controller('conversations')
export class ConversationsController { constructor(private conversations: ConversationsService) {}
  @Post('direct') direct(@Req() req: any, @Body() dto: DirectConversationDto) { return this.conversations.direct(req.user.id, dto.peerUserId); }
  @Post('group') group(@Req() req: any, @Body() dto: GroupConversationDto) { return this.conversations.group(req.user.id, dto.title, dto.memberIds); }
  @Get() list(@Req() req: any) { return this.conversations.list(req.user.id); }
  @Get(':id') get(@Req() req: any, @Param('id') id: string) { return this.conversations.get(id, req.user.id); }
  @Post(':id/members') add(@Req() req: any, @Param('id') id: string, @Body() dto: AddMemberDto) { return this.conversations.addMember(id, req.user.id, dto.userId, dto.role ?? 'MEMBER'); }
  @Delete(':id/members/:userId') remove(@Req() req: any, @Param('id') id: string, @Param('userId') userId: string) { return this.conversations.removeMember(id, req.user.id, userId); }
}
