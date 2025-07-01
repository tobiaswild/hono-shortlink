import type { Context, Next } from 'hono';
import { deleteCookie, getCookie } from 'hono/cookie';
import { APP_CONFIG } from '@/config/app.js';
import sessionStore from '@/db/store/session.js';

export const requireNoAuth = async (c: Context, next: Next) => {
  const sessionId = getCookie(c, APP_CONFIG.SESSION_COOKIE);
  if (sessionId === undefined) {
    await next();

    return;
  }

  const hasSession = await sessionStore.has(sessionId);
  if (!hasSession) {
    deleteCookie(c, APP_CONFIG.SESSION_COOKIE);

    await next();

    return;
  }

  const session = await sessionStore.get(sessionId);
  if (!session || session.expires < Date.now()) {
    deleteCookie(c, APP_CONFIG.SESSION_COOKIE);

    await next();

    return;
  }

  return c.redirect('/dashboard');
};
