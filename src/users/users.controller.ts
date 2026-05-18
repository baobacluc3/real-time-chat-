import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UsersService } from './users.service';
@UseGuards(JwtAuthGuard) @Controller('users')
export class UsersController { constructor(private users: UsersService) {}
  @Get('me') me(@Req() req: any) { return this.users.findMe(req.user.id); }
  @Get('search') search(@Query('q') q = '') { return this.users.search(q); }
}
