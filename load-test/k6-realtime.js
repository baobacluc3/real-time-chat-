import http from 'k6/http';
import ws from 'k6/ws';
import { check, sleep } from 'k6';
export const options = { scenarios: { ws_chat: { executor: 'constant-vus', vus: 25, duration: '1m' } } };
const BASE = __ENV.BASE_URL || 'http://localhost:3000';
export default function () {
  const email = `load-${__VU}-${Date.now()}@example.com`;
  const password = 'password123';
  http.post(`${BASE}/auth/register`, JSON.stringify({ email, username: `load${__VU}${Date.now()}`, displayName: `Load ${__VU}`, password }), { headers: { 'Content-Type': 'application/json' } });
  const login = http.post(`${BASE}/auth/login`, JSON.stringify({ email, password }), { headers: { 'Content-Type': 'application/json' } });
  check(login, { 'login ok': (r) => r.status === 201 || r.status === 200 });
  const token = login.json('accessToken');
  if (!token) return;
  ws.connect(BASE.replace('http', 'ws'), { headers: { Authorization: `Bearer ${token}` } }, (socket) => {
    socket.on('open', () => { socket.send(JSON.stringify({ type: 'presence:heartbeat' })); });
    socket.setInterval(() => socket.send(JSON.stringify({ event: 'typing:start', data: { conversationId: __ENV.CONVERSATION_ID || 'demo' } })), 1000);
    socket.setTimeout(() => socket.close(), 5000);
  });
  sleep(1);
}
