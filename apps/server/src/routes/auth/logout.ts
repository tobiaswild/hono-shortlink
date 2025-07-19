import { Hono } from 'hono';
import sessionStore from '../../db/store/session.js';
import { requireAuth } from '../../middleware/auth.js';
import { deleteSession, getSession } from '../../util/session.js';

const app = new Hono();

app.post('/', requireAuth, async (c) => {
  const sessionId = getSession(c);
  if (sessionId) {
    await sessionStore.delete(sessionId);
  }

  deleteSession(c);

  return c.json({
    success: true,
    message: 'you got logged out',
  });
});

export default app;
