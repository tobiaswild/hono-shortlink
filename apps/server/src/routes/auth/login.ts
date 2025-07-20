import { zValidator } from '@hono/zod-validator';
import * as schemas from '@repo/schemas';
import type { ApiErrorResponse, ApiSuccessResponse } from '@repo/types';
import { Hono } from 'hono';
import { APP_CONFIG } from '../../config/app.js';
import sessionStore from '../../db/store/session.js';
import userStore from '../../db/store/user.js';
import { verifyPassword } from '../../util/password.js';
import { setSession } from '../../util/session.js';

const app = new Hono();

app.post('/', zValidator('json', schemas.loginSchema), async (c) => {
  const validated = c.req.valid('json');
  const username = validated.username;
  const password = validated.password;

  const user = await userStore.getByUsername(username);
  if (!user) {
    return c.json<ApiErrorResponse>(
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
    return c.json<ApiErrorResponse>(
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

  return c.json<ApiSuccessResponse>({
    success: true,
    type: 'success',
    message: 'your logged in',
  });
});

export default app;
