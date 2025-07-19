import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod/v4';
import { APP_CONFIG } from '@/config/app.js';
import sessionStore from '@/db/store/session.js';
import userStore from '@/db/store/user.js';
import RegisterPage from '@/templates/register.js';
import { getFlash, setFlash } from '@/util/flash.js';
import { hashPassword } from '@/util/password.js';
import { setSession } from '@/util/session.js';

const app = new Hono();

app.get('/', (c) => {
  const flash = getFlash(c);

  return c.html(RegisterPage({ flash }));
});

app.post(
  '/',
  zValidator(
    'form',
    z.object({
      username: z.string(),
      password: z.string(),
      confirmPassword: z.string(),
    }),
  ),
  async (c) => {
    const validated = c.req.valid('form');
    const username = validated.username;
    const password = validated.password;
    const confirmPassword = validated.confirmPassword;

    if (!username || !password || !confirmPassword) {
      setFlash(c, {
        type: 'error',
        message: 'Username and password are required',
      });

      return c.redirect('/auth/register');
    }

    if (password !== confirmPassword) {
      setFlash(c, { type: 'error', message: 'Passwords do not match' });

      return c.redirect('/auth/register');
    }

    if (password.length < 6) {
      setFlash(c, {
        type: 'error',
        message: 'Password must be at least 6 characters long',
      });

      return c.redirect('/auth/register');
    }

    const existingUser = await userStore.getByUsername(username);
    if (existingUser) {
      setFlash(c, { type: 'error', message: 'Username already exists' });

      return c.redirect('/auth/register');
    }

    const hashedPassword = await hashPassword(password);
    const _result = await userStore.create(username, hashedPassword);

    const newUser = await userStore.getByUsername(username);
    if (!newUser) {
      setFlash(c, { type: 'error', message: 'Failed to create user' });

      return c.redirect('/auth/register');
    }

    const sessionId = crypto.randomUUID();
    const expires = Date.now() + APP_CONFIG.SESSION_MAX_AGE;
    await sessionStore.set(sessionId, newUser.id, expires);

    setSession(c, sessionId);

    return c.redirect('/dashboard');
  },
);

export default app;
