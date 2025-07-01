import type { Context, Next } from 'hono';
import { deleteCookie, getCookie } from 'hono/cookie';
import { APP_CONFIG } from '@/config/app.js';
import sessionStore from '@/db/store/session.js';
import userStore from '@/db/store/user.js';

export const requireAuth = async (c: Context, next: Next) => {
  const sessionId = getCookie(c, APP_CONFIG.SESSION_COOKIE);
  if (!sessionId) {
    return c.redirect('/admin/login');
  }

  const hasSession = await sessionStore.has(sessionId);
  if (!hasSession) {
    return c.redirect('/admin/login');
  }

  const session = await sessionStore.get(sessionId);
  if (!session) {
    await sessionStore.delete(sessionId);
    deleteCookie(c, APP_CONFIG.SESSION_COOKIE);
    return c.redirect('/admin/login');
  }

  if (session.expires < Date.now()) {
    sessionStore.delete(sessionId);
    deleteCookie(c, APP_CONFIG.SESSION_COOKIE);
    return c.redirect('/admin/login');
  }

  // Get user information
  const user = await userStore.getById(session.userId);
  if (!user) {
    sessionStore.delete(sessionId);
    deleteCookie(c, APP_CONFIG.SESSION_COOKIE);
    return c.redirect('/admin/login');
  }

  // Add user to context
  c.set('user', user);

  await next();
};
