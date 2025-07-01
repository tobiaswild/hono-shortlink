import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { APP_CONFIG } from '@/config/app.js';
import sessionStore from '@/db/store/session.js';
import userStore from '@/db/store/user.js'; 
import LoginPage from '@/templates/login.js';
import { verifyPassword } from '@/util/password.js';

const app = new Hono();

app.get('/', (c) => {
  return c.html(LoginPage());
});

app.post('/', async (c) => {
  const formData = await c.req.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return c.html(LoginPage());
  }

  const user = await userStore.getByUsername(username);
  if (!user) {
    return c.html(LoginPage());
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) {
    return c.html(LoginPage());
  }

  const sessionId = crypto.randomUUID();
  const expires = Date.now() + APP_CONFIG.SESSION_MAX_AGE;
  await sessionStore.set(sessionId, user.id, expires);

  setCookie(c, APP_CONFIG.SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: APP_CONFIG.SESSION_MAX_AGE / 1000,
  });

  return c.redirect('/dashboard');
});

export default app;
