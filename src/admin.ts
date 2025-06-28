import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import * as z from 'zod/v4';
import DashboardPage from './templates/dashboard.js';
import LoginPage from './templates/login.js';
import urlStore from './urlStore.js';
import { getCode } from './util/code.js';
import { wantsHtml } from './util/html.js';
import { getBaseUrl } from './util/url.js';

// Admin API key - in production, use environment variable
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'your-secret-admin-key';

// Simple session management
const sessions = new Map<string, { isAdmin: boolean; expires: number }>();

// Middleware to check admin authentication
const requireAdminAuth = async (c: any, next: any) => {
  const sessionId = getCookie(c, 'admin_session');

  if (!sessionId || !sessions.has(sessionId)) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const session = sessions.get(sessionId);
  if (!session || !session.isAdmin || session.expires < Date.now()) {
    sessions.delete(sessionId);
    setCookie(c, 'admin_session', '', { maxAge: 0, path: '/' });
    return c.json({ error: 'Session expired' }, 401);
  }

  await next();
};

const app = new Hono();

app.get('/dashboard', async (c) => {
  const sessionId = getCookie(c, 'admin_session');
  const isAuthenticated = sessionId && sessions.has(sessionId);

  if (!isAuthenticated) {
    return c.redirect('/admin/login');
  }

  const shortlinks = await urlStore.getAll();

  return c.html(DashboardPage({ shortlinks, baseUrl: getBaseUrl(c) }));
});

app.get('/login', (c) => {
  const sessionId = getCookie(c, 'admin_session');
  const isAuthenticated = sessionId && sessions.has(sessionId);

  if (isAuthenticated) {
    return c.redirect('/admin/dashboard');
  }

  return c.html(LoginPage());
});

app.post(
  '/login',
  zValidator(
    'form',
    z.object({
      apiKey: z.string(),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json({ error: 'Invalid API key' }, 401);
      }
    }
  ),
  async (c) => {
    const formData = await c.req.formData();

    const apiKey = formData.get('apiKey');

    console.log(apiKey);

    if (apiKey !== ADMIN_API_KEY) {
      return c.json({ error: 'Invalid API key' }, 401);
    }

    const sessionId = crypto.randomUUID();
    const expires = Date.now() + 24 * 60 * 60 * 1000;
    sessions.set(sessionId, { isAdmin: true, expires });

    setCookie(c, 'admin_session', sessionId, { maxAge: 86400, path: '/', sameSite: 'Lax' });

    return c.redirect('/admin/dashboard');
  }
);

// Logout route
app.post('/logout', async (c) => {
  const sessionId = getCookie(c, 'admin_session');
  if (sessionId) {
    sessions.delete(sessionId);
  }
  setCookie(c, 'admin_session', '', { maxAge: 0, path: '/' });

  if (!wantsHtml(c)) {
    return c.json({ message: 'you got signed out' }, 200);
  }

  return c.redirect('/admin/login');
});

// Create shortlink route
app.post(
  '/create',
  requireAdminAuth,
  zValidator(
    'json',
    z.object({
      url: z.url(),
      customCode: z.string().length(6).optional(),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json({ error: z.prettifyError(result.error) }, 400);
      }
    }
  ),
  async (c) => {
    const body = c.req.valid('json');
    const { url, customCode } = body;

    try {
      let code: string;

      if (customCode) {
        // Check if custom code already exists
        const exists = await urlStore.has(customCode);
        if (exists) {
          return c.json({ error: 'Custom code already exists' }, 400);
        }
        code = customCode;
      } else {
        code = await getCode();
      }

      await urlStore.set(code, url);

      const shortUrl = `${c.req.url.split('/').slice(0, 3).join('/')}/${code}`;

      return c.json({ short: shortUrl });
    } catch (error) {
      return c.json({ error: 'Failed to create shortlink' }, 500);
    }
  }
);

// Delete shortlink route
app.delete(
  '/delete/:code',
  requireAdminAuth,
  zValidator(
    'param',
    z.object({
      code: z.string().length(6),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json({ error: z.prettifyError(result.error) }, 400);
      }
    }
  ),
  async (c) => {
    const { code } = c.req.valid('param');

    try {
      const deleted = await urlStore.delete(code);

      if (!deleted) {
        return c.json({ error: 'Shortlink not found' }, 404);
      }

      return c.json({ success: true, message: 'Shortlink deleted successfully' });
    } catch (error) {
      return c.json({ error: 'Failed to delete shortlink' }, 500);
    }
  }
);

export default app;
