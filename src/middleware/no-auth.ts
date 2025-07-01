import type { Context, Next } from 'hono';
import sessionStore from '@/db/store/session.js';
import { deleteSession, getSession } from '@/util/session.js';

export const requireNoAuth = async (c: Context, next: Next) => {
  const sessionId = getSession(c);
  if (sessionId === undefined) {
    await next();

    return;
  }

  const hasSession = await sessionStore.has(sessionId);
  if (!hasSession) {
    deleteSession(c);

    await next();

    return;
  }

  const session = await sessionStore.get(sessionId);
  if (!session || session.expires < Date.now()) {
    deleteSession(c);

    await next();

    return;
  }

  return c.redirect('/dashboard');
};
