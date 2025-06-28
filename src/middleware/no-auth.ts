import sessionStore from '@/sessionStore.js';
import { wantsHtml } from '@/util/html.js';
import { SESSION_COOKIE } from '@/util/session.js';
import type { Context, Next } from 'hono';
import { deleteCookie, getCookie } from 'hono/cookie';

export const requireNoAuth = async (c: Context, next: Next) => {
  const sessionId = getCookie(c, SESSION_COOKIE);
  if (sessionId === undefined) {
    await next();

    return;
  }

  const hasSession = await sessionStore.has(sessionId);
  if (!hasSession) {
    deleteCookie(c, SESSION_COOKIE);

    next();

    return;
  }

  const session = await sessionStore.get(sessionId);
  if (!session || session.expires < Date.now()) {
    deleteCookie(c, SESSION_COOKIE);

    next();

    return;
  }

  if (!wantsHtml(c)) {
    return c.json(
      {
        success: false,
        code: 400,
        message: 'Already authenticated',
      },
      400
    );
  }

  return c.redirect('/admin/dashboard');
};
