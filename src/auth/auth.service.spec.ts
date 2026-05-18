import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
describe('AuthService', () => {
  it('removes passwordHash from API user payloads', () => {
    const service = new AuthService({} as any, new JwtService({ secret: 'test' }));
    expect(service.safeUser({ id: 'u1', email: 'a@b.com', passwordHash: 'secret' })).toEqual({ id: 'u1', email: 'a@b.com' });
  });
});
