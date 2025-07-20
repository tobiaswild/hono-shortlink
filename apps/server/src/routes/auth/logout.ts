import type { ApiSuccessResponse } from '@repo/types';
import { Hono } from 'hono';
import sessionStore from '../../db/store/session.js';
import { authMiddleware } from '../../middleware/auth.js';
import { deleteSession, getSession } from '../../util/session.js';

const app = new Hono();

app.post('/', authMiddleware, async (c) => {
  const sessionId = getSession(c);
  if (sessionId) {
    await sessionStore.delete(sessionId);
  }

  deleteSession(c);

  return c.json<ApiSuccessResponse>({
    success: true,
    type: 'success',
    message: 'you got logged out',
  });
});

export default app;
