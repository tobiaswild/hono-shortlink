import type { Context, Next } from 'hono';
import { deleteCookie, getCookie } from 'hono/cookie';
import sessionStore from '@/sessionStore.js';
import { wantsHtml } from '@/util/html.js';
import { SESSION_COOKIE } from '@/util/session.js';

export const requireAuth = async (c: Context, next: Next) => {
  const sessionId = getCookie(c, SESSION_COOKIE);
  if (!sessionId) {
    if (!wantsHtml(c)) {
      return c.json(
        {
          success: false,
          code: 401,
          message: 'Unauthorized',
        },
        401
      );
    }

    return c.redirect('/admin/login');
  }

  const hasSession = await sessionStore.has(sessionId);
  if (!hasSession) {
    if (!wantsHtml(c)) {
      return c.json(
        {
          success: false,
          code: 401,
          message: 'Session invalid',
        },
        401
      );
    }

    return c.redirect('/admin/login');
  }

  const session = await sessionStore.get(sessionId);
  if (!session) {
    sessionStore.delete(sessionId);
    deleteCookie(c, SESSION_COOKIE);

    if (!wantsHtml(c)) {
      return c.json(
        {
          success: false,
          code: 401,
          message: 'Session invalid',
        },
        401
      );
    }

    return c.redirect('/admin/login');
  }

  if (session.expires < Date.now()) {
    sessionStore.delete(sessionId);
    deleteCookie(c, SESSION_COOKIE);

    if (!wantsHtml(c)) {
      return c.json(
        {
          success: false,
          code: 401,
          message: 'Session expired',
        },
        401
      );
    }

    return c.redirect('/admin/login');
  }

  await next();
};

