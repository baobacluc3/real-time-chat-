import { ForbiddenException } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
describe('ConversationsService membership', () => {
  it('rejects non-members', async () => {
    const service = new ConversationsService({ conversationMember: { findFirst: jest.fn().mockResolvedValue(null) } } as any);
    await expect(service.assertMember('c1', 'u1')).rejects.toBeInstanceOf(ForbiddenException);
  });
});
