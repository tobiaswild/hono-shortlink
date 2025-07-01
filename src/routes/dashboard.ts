import { Hono } from 'hono';
import shortlinkStore from '@/db/store/shortlink.js';
import { requireAuth } from '@/middleware/auth.js';
import DashboardPage from '@/templates/dashboard.js';
import { getCode } from '@/util/code.js';
import { getBaseUrl } from '@/util/url.js';

const app = new Hono();

app.get('/', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/auth/login');
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

app.post('/shortlinks', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/auth/login');
  }
  const formData = await c.req.formData();
  const url = formData.get('url') as string;

  if (!url) {
    return c.redirect('/dashboard');
  }

  let code: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = await getCode();
    attempts++;
  } while ((await shortlinkStore.has(code)) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    return c.redirect('/dashboard');
  }

  await shortlinkStore.set(code, url, user.id);

  return c.redirect('/dashboard');
});

app.delete('/shortlinks/:code', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/auth/login');
  }
  const code = c.req.param('code');

  const shortlinkUrl = await shortlinkStore.get(code);
  if (!shortlinkUrl) {
    return c.redirect('/dashboard');
  }

  const deleted = await shortlinkStore.deleteByUserId(code, user.id);
  if (!deleted) {
    return c.redirect('/dashboard');
  }

  return c.redirect('/dashboard');
});

app.get('/shortlinks', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/auth/login');
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
