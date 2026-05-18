import { RealtimeGateway } from './realtime.gateway';
describe('RealtimeGateway', () => {
  const deps = { auth: { verifySocketToken: jest.fn() }, conversations: { memberConversationIds: jest.fn().mockResolvedValue([]) }, messages: { send: jest.fn().mockResolvedValue({ id: 'm1', conversationId: 'c1' }) }, presence: { connect: jest.fn(), disconnect: jest.fn() }, rateLimit: { check: jest.fn() }, publisher: {} };
  it('rejects sockets without JWT', async () => {
    const gateway = new RealtimeGateway(deps.auth as any, deps.conversations as any, deps.messages as any, deps.presence as any, deps.rateLimit as any, deps.publisher as any);
    const client: any = { id: 's1', handshake: { auth: {}, headers: {} }, emit: jest.fn(), disconnect: jest.fn() };
    await gateway.handleConnection(client);
    expect(client.disconnect).toHaveBeenCalledWith(true);
  });
  it('persists websocket message:send through MessagesService', async () => {
    const gateway = new RealtimeGateway(deps.auth as any, deps.conversations as any, deps.messages as any, deps.presence as any, deps.rateLimit as any, deps.publisher as any);
    gateway.server = { to: () => ({ emit: jest.fn() }) } as any;
    const client: any = { data: { user: { id: 'u1' } } };
    await gateway.send(client, { conversationId: 'c1', body: 'hi', idempotencyKey: 'k' });
    expect(deps.messages.send).toHaveBeenCalledWith('c1', 'u1', 'hi', 'k');
  });
});
