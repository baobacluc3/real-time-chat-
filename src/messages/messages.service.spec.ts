import { MessagesService } from './messages.service';
describe('MessagesService reliability', () => {
  function serviceWith(prisma: any) { return new MessagesService(prisma, { assertMember: jest.fn().mockResolvedValue({}) } as any); }
  it('returns existing message for duplicate idempotency key', async () => {
    const existing = { id: 'm1' };
    const prisma = { message: { findUnique: jest.fn().mockResolvedValue(existing) } };
    await expect(serviceWith(prisma).send('c1', 'u1', 'hello', 'idem')).resolves.toBe(existing);
  });
  it('creates message and outbox event in one transaction', async () => {
    const tx = { message: { create: jest.fn().mockResolvedValue({ id: 'm1', conversationId: 'c1', senderId: 'u1', body: 'hello' }) }, outboxEvent: { create: jest.fn() }, conversation: { update: jest.fn() } };
    const prisma = { message: { findUnique: jest.fn().mockResolvedValue(null) }, $transaction: jest.fn((cb) => cb(tx)) };
    await serviceWith(prisma).send('c1', 'u1', 'hello', 'idem');
    expect(tx.message.create).toHaveBeenCalled(); expect(tx.outboxEvent.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ eventName: 'message:new' }) }));
  });
  it('updates read receipt transactionally', async () => {
    const tx = { messageReadReceipt: { upsert: jest.fn().mockResolvedValue({ readAt: new Date() }) }, outboxEvent: { create: jest.fn() } };
    const prisma = { $transaction: jest.fn((cb) => cb(tx)) };
    await serviceWith(prisma).read('c1', 'u1', 'm1');
    expect(tx.messageReadReceipt.upsert).toHaveBeenCalled(); expect(tx.outboxEvent.create).toHaveBeenCalled();
  });
});
