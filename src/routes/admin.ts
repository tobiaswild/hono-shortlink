import { APP_CONFIG } from '@/config/app.js';
import sessionStore from '@/db/store/session.js';
import shortlinkStore from '@/db/store/shortlink.js';
import userStore from '@/db/store/user.js';
import { requireAuth } from '@/middleware/auth.js';
import DashboardPage from '@/templates/dashboard.js';
import LoginPage from '@/templates/login.js';
import RegisterPage from '@/templates/register.js';
import { getCode } from '@/util/code.js';
import { wantsHtml } from '@/util/html.js';
import { hashPassword, verifyPassword } from '@/util/password.js';
import { getBaseUrl } from '@/util/url.js';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';

const app = new Hono();

// Login page
app.get('/login', (c) => {
  return c.html(LoginPage());
});

// Register page
app.get('/register', (c) => {
  return c.html(RegisterPage());
});

// Login handler
app.post('/login', async (c) => {
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
    maxAge: APP_CONFIG.SESSION_MAX_AGE / 1000, // Convert to seconds
  });

  return c.redirect('/admin');
});

// Register handler
app.post('/register', async (c) => {
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

  const hashedPassword = await hashPassword(password);
  const result = await userStore.create(username, `${username}@example.com`, hashedPassword);

  // Get the created user to get their ID
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

  return c.redirect('/admin');
});

// Logout handler
app.post('/logout', requireAuth, async (c) => {
  const sessionId = getCookie(c, APP_CONFIG.SESSION_COOKIE);
  if (sessionId) {
    await sessionStore.delete(sessionId);
  }

  setCookie(c, APP_CONFIG.SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
  });

  return c.redirect('/admin/login');
});

// Dashboard
app.get('/', requireAuth, async (c) => {
  const user = c.get('user');
  const shortlinks = await shortlinkStore.getAllByUserId(user.id);

  return c.html(
    DashboardPage({
      shortlinks,
      baseUrl: getBaseUrl(c),
      user,
    })
  );
});

// Create shortlink
app.post('/shortlinks', requireAuth, async (c) => {
  const user = c.get('user');
  const formData = await c.req.formData();
  const url = formData.get('url') as string;

  if (!url) {
    if (!wantsHtml(c)) {
      return c.json(
        {
          success: false,
          code: 400,
          message: 'URL is required',
        },
        400
      );
    }

    return c.html(
      DashboardPage({
        shortlinks: await shortlinkStore.getAllByUserId(user.id),
        baseUrl: getBaseUrl(c),
        user,
      })
    );
  }

  let code: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = await getCode();
    attempts++;
  } while ((await shortlinkStore.has(code)) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    if (!wantsHtml(c)) {
      return c.json(
        {
          success: false,
          code: 500,
          message: 'Failed to generate unique code',
        },
        500
      );
    }

    return c.html(
      DashboardPage({
        shortlinks: await shortlinkStore.getAllByUserId(user.id),
        baseUrl: getBaseUrl(c),
        user,
      })
    );
  }

  await shortlinkStore.set(code, url, user.id);

  if (!wantsHtml(c)) {
    return c.json({
      success: true,
      data: {
        code,
        url,
        shortUrl: `${getBaseUrl(c)}/${code}`,
      },
    });
  }

  return c.redirect('/admin');
});

// Delete shortlink
app.delete('/shortlinks/:code', requireAuth, async (c) => {
  const user = c.get('user');
  const code = c.req.param('code');

  const shortlinkUrl = await shortlinkStore.get(code);
  if (!shortlinkUrl) {
    return c.json(
      {
        success: false,
        code: 404,
        message: 'Shortlink not found',
      },
      404
    );
  }

  // For now, we'll delete without checking ownership since the store doesn't return userId
  // In a real app, you'd want to modify the store to return full shortlink objects
  const deleted = await shortlinkStore.deleteByUserId(code, user.id);
  if (!deleted) {
    return c.json(
      {
        success: false,
        code: 403,
        message: 'Forbidden',
      },
      403
    );
  }

  return c.json({
    success: true,
    message: 'Shortlink deleted',
  });
});

// API endpoint to get user's shortlinks
app.get('/shortlinks', requireAuth, async (c) => {
  const user = c.get('user');
  const shortlinks = await shortlinkStore.getAllByUserId(user.id);

  return c.json({
    success: true,
    data: shortlinks.map((link: any) => ({
      code: link.code,
      url: link.url,
      shortUrl: `${getBaseUrl(c)}/${link.code}`,
      createdAt: link.createdAt,
    })),
  });
});

export default app;
