import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { PrismaService } from '../database/prisma.service';
import { LoginDto, RegisterDto } from './dto';
@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  safeUser(user: any) { const { passwordHash: _passwordHash, ...safe } = user; return safe; }
  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findFirst({ where: { OR: [{ email: dto.email }, { username: dto.username }] } });
    if (existing) throw new ConflictException('email or username already exists');
    const user = await this.prisma.user.create({ data: { email: dto.email.toLowerCase(), username: dto.username, displayName: dto.displayName, passwordHash: await argon2.hash(dto.password) } });
    return this.issueTokens(user);
  }
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email.toLowerCase() } });
    if (!user || !(await argon2.verify(user.passwordHash, dto.password))) throw new UnauthorizedException('invalid credentials');
    return this.issueTokens(user);
  }
  async issueTokens(user: any) {
    const safeUser = this.safeUser(user);
    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email, username: user.username, displayName: user.displayName });
    return { user: safeUser, accessToken };
  }
  verifySocketToken(token: string) { return this.jwt.verify(token) as any; }
}
