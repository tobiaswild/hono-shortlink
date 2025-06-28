import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import * as z from 'zod/v4';
import { requireAuth } from './middleware/auth.js';
import { requireNoAuth } from './middleware/no-auth.js';
import sessionStore from './sessionStore.js';
import DashboardPage from './templates/dashboard.js';
import LoginPage from './templates/login.js';
import urlStore from './urlStore.js';
import { getCode } from './util/code.js';
import { wantsHtml } from './util/html.js';
import { SESSION_COOKIE } from './util/session.js';
import { getBaseUrl } from './util/url.js';

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'your-secret-admin-key';

const app = new Hono();

app.get('/dashboard', requireAuth, async (c) => {
  const shortlinks = await urlStore.getAll();

  if (!wantsHtml(c)) {
    return c.json(
      {
        success: true,
        code: 200,
        data: shortlinks,
      },
      200
    );
  }

  return c.html(DashboardPage({ shortlinks, baseUrl: getBaseUrl(c) }));
});

app.get('/login', requireNoAuth, (c) => {
  if (!wantsHtml(c)) {
    return c.json(
      {
        success: false,
        code: 400,
        message: 'login via post',
      },
      400
    );
  }

  return c.html(LoginPage());
});

app.post('/login', requireNoAuth, async (c) => {
  const formData = await c.req.formData();

  const apiKey = formData.get('apiKey');

  if (apiKey !== ADMIN_API_KEY) {
    if (!wantsHtml(c)) {
      return c.json(
        {
          success: false,
          code: 401,
          error: 'Invalid API key',
        },
        401
      );
    }

    return c.redirect('/admin/login');
  }

  const sessionId = crypto.randomUUID();

  const expires = Date.now() + 24 * 60 * 60 * 1000;

  sessionStore.set(sessionId, expires);

  setCookie(c, SESSION_COOKIE, sessionId, { maxAge: 86400, path: '/', sameSite: 'Lax' });

  if (!wantsHtml(c)) {
    return c.json({
      success: true,
      code: 200,
      message: 'logged in',
    });
  }

  return c.redirect('/admin/dashboard');
});

app.post('/logout', requireAuth, async (c) => {
  const sessionId = getCookie(c, SESSION_COOKIE);
  if (sessionId) {
    sessionStore.delete(sessionId);
  }
  setCookie(c, SESSION_COOKIE, '', { maxAge: 0, path: '/' });

  if (!wantsHtml(c)) {
    return c.json({ success: true, code: 200, message: 'you got signed out' }, 200);
  }

  return c.redirect('/admin/login');
});

app.post(
  '/create',
  requireAuth,
  zValidator(
    'form',
    z.object({
      url: z.url(),
      customCode: z.string().length(6).optional(),
    }),
    (result, c) => {
      if (!result.success) {
        if (!wantsHtml(c)) {
          return c.json(
            {
              success: false,
              code: 400,
              error: z.prettifyError(result.error),
            },
            400
          );
        }

        return c.redirect('/admin/dashboard');
      }
    }
  ),
  async (c) => {
    const body = c.req.valid('form');
    const { url, customCode } = body;

    try {
      let code: string;

      if (customCode) {
        const exists = await urlStore.has(customCode);

        if (exists) {
          if (!wantsHtml(c)) {
            return c.json(
              {
                success: false,
                code: 400,
                error: 'Custom code already exists',
              },
              400
            );
          }

          return c.redirect('/admin/dashboard');
        }
        code = customCode;
      } else {
        code = await getCode();
      }

      await urlStore.set(code, url);

      const shortUrl = `${getBaseUrl(c)}/${code}`;

      if (!wantsHtml(c)) {
        return c.json({ success: true, code: 200, short: shortUrl });
      }

      return c.redirect('/admin/dashboard');
    } catch (error) {
      if (!wantsHtml(c)) {
        return c.json({ success: false, code: 500, error: 'Failed to create shortlink' }, 500);
      }

      return c.redirect('/admin/dashboard');
    }
  }
);

app.post(
  '/delete/:code',
  requireAuth,
  zValidator(
    'param',
    z.object({
      code: z.string().length(6),
    }),
    (result, c) => {
      if (!result.success) {
        if (!wantsHtml(c)) {
          return c.json(
            {
              success: false,
              code: 400,
              error: z.prettifyError(result.error),
            },
            400
          );
        }

        return c.redirect('/admin/dashboard');
      }
    }
  ),
  async (c) => {
    const { code } = c.req.valid('param');

    try {
      const deleted = await urlStore.delete(code);

      if (!deleted) {
        if (!wantsHtml(c)) {
          return c.json(
            {
              success: false,
              code: 404,
              error: 'Shortlink not found',
            },
            404
          );
        }

        return c.redirect('/admin/dashboard');
      }

      if (!wantsHtml(c)) {
        return c.json({
          success: true,
          code: 200,
          message: 'Shortlink deleted successfully',
        });
      }

      return c.redirect('/admin/dashboard');
    } catch (error) {
      if (!wantsHtml(c)) {
        return c.json(
          {
            success: false,
            code: 500,
            error: 'Failed to delete shortlink',
          },
          500
        );
      }

      return c.redirect('/admin/dashboard');
    }
  }
);

export default app;
