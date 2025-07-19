import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod/v4';
import { APP_CONFIG } from '../../config/app.js';
import sessionStore from '../../db/store/session.js';
import userStore from '../../db/store/user.js';
import { hashPassword } from '../../util/password.js';
import { setSession } from '../../util/session.js';

const app = new Hono();

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
      return c.json({
        type: 'error',
        message: 'Username and password are required',
      });
    }

    if (password !== confirmPassword) {
      return c.json({ type: 'error', message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return c.json({
        type: 'error',
        message: 'Password must be at least 6 characters long',
      });
    }

    const existingUser = await userStore.getByUsername(username);
    if (existingUser) {
      return c.json({ type: 'error', message: 'Username already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const _result = await userStore.create(username, hashedPassword);

    const newUser = await userStore.getByUsername(username);
    if (!newUser) {
      return c.json({ type: 'error', message: 'Failed to create user' });
    }

    const sessionId = crypto.randomUUID();
    const expires = Date.now() + APP_CONFIG.SESSION_MAX_AGE;
    await sessionStore.set(sessionId, newUser.id, expires);

    setSession(c, sessionId);

    return c.json({
      success: true,
    });
  },
);

export default app;
