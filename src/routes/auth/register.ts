import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import { APP_CONFIG } from '@/config/app.js';
import sessionStore from '@/db/store/session.js';
import userStore from '@/db/store/user.js';
import RegisterPage from '@/templates/register.js';
import { hashPassword } from '@/util/password.js';

const app = new Hono();

app.get('/', (c) => {
  return c.html(RegisterPage());
});

app.post('/', async (c) => {
  const formData = await c.req.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!username || !password || !confirmPassword) {
    return c.html(RegisterPage());
  }

  if (password !== confirmPassword) {
    return c.html(RegisterPage());
  }

  if (password.length < 6) {
    return c.html(RegisterPage());
  }

  const existingUser = await userStore.getByUsername(username);
  if (existingUser) {
    return c.html(RegisterPage());
  }

  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return c.html(RegisterPage());
  }

  const hashedPassword = await hashPassword(password);
  const _result = await userStore.create(username, email, hashedPassword);

  const newUser = await userStore.getByUsername(username);
  if (!newUser) {
    return c.html(RegisterPage());
  }

  const sessionId = crypto.randomUUID();
  const expires = Date.now() + APP_CONFIG.SESSION_MAX_AGE;
  await sessionStore.set(sessionId, newUser.id, expires);

  setCookie(c, APP_CONFIG.SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: APP_CONFIG.SESSION_MAX_AGE / 1000, // Convert to seconds
  });

  return c.redirect('/dashboard');
});

export default app;
