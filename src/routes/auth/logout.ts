import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { APP_CONFIG } from '@/config/app.js';
import sessionStore from '@/db/store/session.js';
import { requireAuth } from '@/middleware/auth.js';

const app = new Hono();

app.post('/', requireAuth, async (c) => {
  const sessionId = getCookie(c, APP_CONFIG.SESSION_COOKIE);
  if (sessionId) {
    await sessionStore.delete(sessionId);
  }

  setCookie(c, APP_CONFIG.SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });

  return c.redirect('/auth/login');
});

export default app;
