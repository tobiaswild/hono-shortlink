import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { APP_CONFIG } from '@/config/app.js';
import sessionStore from '@/db/store/session.js';
import shortlinkStore from '@/db/store/shortlink.js';
import userStore from '@/db/store/user.js';
import { requireAuth } from '@/middleware/auth.js';
import DashboardPage from '@/templates/dashboard.js';
import LoginPage from '@/templates/login.js';
import RegisterPage from '@/templates/register.js';
import { getCode } from '@/util/code.js';
import { hashPassword, verifyPassword } from '@/util/password.js';
import { getBaseUrl } from '@/util/url.js';

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

  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return c.html(RegisterPage());
  }

  const hashedPassword = await hashPassword(password);
  const _result = await userStore.create(username, email, hashedPassword);

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
  if (!user) {
    return c.redirect('/admin/login');
  }
  const shortlinks = await shortlinkStore.getAllByUserId(user.id);

  return c.html(
    DashboardPage({
      shortlinks,
      baseUrl: getBaseUrl(c),
      user,
    }),
  );
});

// Create shortlink
app.post('/shortlinks', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/admin/login');
  }
  const formData = await c.req.formData();
  const url = formData.get('url') as string;

  if (!url) {
    return c.redirect('/admin');
  }

  let code: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = await getCode();
    attempts++;
  } while ((await shortlinkStore.has(code)) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    return c.redirect('/admin');
  }

  await shortlinkStore.set(code, url, user.id);

  return c.redirect('/admin');
});

// Delete shortlink
app.delete('/shortlinks/:code', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/admin/login');
  }
  const code = c.req.param('code');

  const shortlinkUrl = await shortlinkStore.get(code);
  if (!shortlinkUrl) {
    return c.redirect('/admin');
  }

  // For now, we'll delete without checking ownership since the store doesn't return userId
  // In a real app, you'd want to modify the store to return full shortlink objects
  const deleted = await shortlinkStore.deleteByUserId(code, user.id);
  if (!deleted) {
    return c.redirect('/admin');
  }

  return c.redirect('/admin');
});

// API endpoint to get user's shortlinks
app.get('/shortlinks', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/admin/login');
  }
  const shortlinks = await shortlinkStore.getAllByUserId(user.id);

  return c.json({
    success: true,
    data: shortlinks.map((link) => ({
      code: link.code,
      url: link.url,
      shortUrl: `${getBaseUrl(c)}/${link.code}`,
    })),
  });
});

export default app;
