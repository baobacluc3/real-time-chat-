import { OutboxProcessor } from './outbox.processor';
describe('OutboxProcessor', () => {
  it('publishes pending events and marks them published', async () => {
    const prisma = { outboxEvent: { findMany: jest.fn().mockResolvedValue([{ id: 'o1', conversationId: 'c1', eventName: 'message:new', payload: {} }]), update: jest.fn() } };
    const publisher = { publishConversation: jest.fn() };
    await new OutboxProcessor(prisma as any, publisher as any).process();
    expect(publisher.publishConversation).toHaveBeenCalledWith('c1', 'message:new', {}); expect(prisma.outboxEvent.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ status: 'PUBLISHED' }) }));
  });
});
