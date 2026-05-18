export interface AuthUser { id: string; email: string; username: string; displayName?: string }
export interface RequestWithUser extends Request { user: AuthUser; correlationId?: string }
export interface RealtimeSocket { id: string; user?: AuthUser; handshake: { auth?: Record<string, string>; headers?: Record<string, string | string[] | undefined> }; join(room: string): Promise<void> | void; leave(room: string): Promise<void> | void; emit(event: string, payload?: unknown): void }
export const userRoom = (userId: string) => `user:${userId}`;
export const conversationRoom = (conversationId: string) => `conversation:${conversationId}`;
