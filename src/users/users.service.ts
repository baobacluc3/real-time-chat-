import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
@Injectable()
export class UsersService { constructor(private prisma: PrismaService) {}
  private select = { id: true, email: true, username: true, displayName: true, createdAt: true };
  findMe(id: string) { return this.prisma.user.findUnique({ where: { id }, select: this.select }); }
  search(q: string) { return this.prisma.user.findMany({ where: { OR: [{ username: { contains: q, mode: 'insensitive' } }, { displayName: { contains: q, mode: 'insensitive' } }] }, take: 20, select: this.select }); }
}
