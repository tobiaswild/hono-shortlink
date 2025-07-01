import type { Context, Next } from 'hono';
import sessionStore from '@/db/store/session.js';
import userStore from '@/db/store/user.js';
import { deleteSession, getSession } from '@/util/session.js';

export const requireAuth = async (c: Context, next: Next) => {
  const sessionId = getSession(c);
  if (!sessionId) {
    return c.redirect('/auth/login');
  }

  const hasSession = await sessionStore.has(sessionId);
  if (!hasSession) {
    return c.redirect('/auth/login');
  }

  const session = await sessionStore.get(sessionId);
  if (!session) {
    await sessionStore.delete(sessionId);

    deleteSession(c);

    return c.redirect('/auth/login');
  }

  if (session.expires < Date.now()) {
    sessionStore.delete(sessionId);

    deleteSession(c);

    return c.redirect('/auth/login');
  }

  const user = await userStore.getById(session.userId);
  if (!user) {
    sessionStore.delete(sessionId);

    deleteSession(c);

    return c.redirect('/auth/login');
  }

  c.set('user', user);

  await next();
};
