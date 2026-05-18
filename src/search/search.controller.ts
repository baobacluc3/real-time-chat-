import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SearchService } from './search.service';
@UseGuards(JwtAuthGuard) @Controller('search')
export class SearchController { constructor(private search: SearchService) {} @Get('messages') messages(@Req() req: any, @Query('q') q = '', @Query('conversationId') conversationId?: string) { return this.search.messages(req.user.id, q, conversationId); } }
