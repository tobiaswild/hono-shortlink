import { zValidator } from '@hono/zod-validator';
import * as schemas from '@repo/schemas';
import type { ApiErrorResponse, ApiSuccessResponse } from '@repo/types';
import { Hono } from 'hono';
import { APP_CONFIG } from '../../config/app.js';
import sessionStore from '../../db/store/session.js';
import userStore from '../../db/store/user.js';
import { hashPassword } from '../../util/password.js';
import { setSession } from '../../util/session.js';

const app = new Hono();

app.post('/', zValidator('json', schemas.registerSchema), async (c) => {
  const validated = c.req.valid('json');
  const username = validated.username;
  const password = validated.password;
  const confirmPassword = validated.confirmPassword;

  if (password !== confirmPassword) {
    return c.json<ApiErrorResponse>({
      success: false,
      type: 'error',
      message: 'Passwords do not match',
    });
  }

  const existingUser = await userStore.getByUsername(username);
  if (existingUser) {
    return c.json<ApiErrorResponse>({
      success: false,
      type: 'error',
      message: 'Username already exists',
    });
  }

  const hashedPassword = await hashPassword(password);
  const _result = await userStore.create(username, hashedPassword);

  const newUser = await userStore.getByUsername(username);
  if (!newUser) {
    return c.json<ApiErrorResponse>({
      success: false,
      type: 'error',
      message: 'Failed to create user',
    });
  }

  const sessionId = crypto.randomUUID();
  const expires = Date.now() + APP_CONFIG.SESSION_MAX_AGE;
  await sessionStore.set(sessionId, newUser.id, expires);

  setSession(c, sessionId);

  return c.json<ApiSuccessResponse>({
    success: true,
    type: 'success',
    message: 'you got registered',
  });
});

export default app;
