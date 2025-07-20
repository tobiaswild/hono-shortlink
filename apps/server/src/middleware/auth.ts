import { createMiddleware } from 'hono/factory';
import type { User } from 'src/db/schema/user.js';
import sessionStore from '../db/store/session.js';
import userStore from '../db/store/user.js';
import { deleteSession, getSession } from '../util/session.js';

export const authMiddleware = createMiddleware<{
  Variables: {
    user: User;
  };
}>(async (c, next) => {
  const sessionId = getSession(c);
  if (!sessionId) {
    return c.json(
      {
        success: false,
        message: 'an error occured',
      },
      400,
    );
  }

  const hasSession = await sessionStore.has(sessionId);
  if (!hasSession) {
    deleteSession(c);

    return c.json(
      {
        success: false,
        message: 'an error occured',
      },
      400,
    );
  }

  const session = await sessionStore.get(sessionId);
  if (!session) {
    await sessionStore.delete(sessionId);

    deleteSession(c);

    return c.json(
      {
        success: false,
        message: 'an error occured',
      },
      400,
    );
  }

  if (session.expires < Date.now()) {
    sessionStore.delete(sessionId);

    deleteSession(c);

    return c.json(
      {
        success: false,
        message: 'an error occured',
      },
      400,
    );
  }

  const user = await userStore.getById(session.userId);
  if (!user) {
    sessionStore.delete(sessionId);

    deleteSession(c);

    return c.json(
      {
        success: false,
        message: 'an error occured',
      },
      400,
    );
  }

  c.set('user', user);

  await next();
});
