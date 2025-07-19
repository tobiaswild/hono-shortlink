import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod/v4';
import { APP_CONFIG } from '../../config/app.js';
import sessionStore from '../../db/store/session.js';
import userStore from '../../db/store/user.js';
import { verifyPassword } from '../../util/password.js';
import { setSession } from '../../util/session.js';

const app = new Hono();

app.post(
  '/',
  zValidator(
    'json',
    z.object({
      username: z.string(),
      password: z.string(),
    }),
  ),
  async (c) => {
    const validated = c.req.valid('json');
    const username = validated.username;
    const password = validated.password;

    if (!username || !password) {
      return c.json(
        {
          success: false,
          type: 'error',
          message: 'Username and password are required',
        },
        400,
      );
    }

    const user = await userStore.getByUsername(username);
    if (!user) {
      return c.json(
        {
          success: false,
          type: 'error',
          message: 'Invalid username or password',
        },
        400,
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return c.json(
        {
          success: false,
          type: 'error',
          message: 'Invalid username or password',
        },
        400,
      );
    }

    const sessionId = crypto.randomUUID();
    const expires = Date.now() + APP_CONFIG.SESSION_MAX_AGE;
    await sessionStore.set(sessionId, user.id, expires);

    setSession(c, sessionId);

    return c.json({
      success: true,
      message: 'your logged in',
    });
  },
);

export default app;
