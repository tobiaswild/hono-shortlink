import { Hono } from 'hono';
import shortlinkStore from '@/db/store/shortlink.js';
import { requireAuth } from '@/middleware/auth.js';
import { getCode } from '@/util/code.js';

const app = new Hono();

app.post('/', requireAuth, async (c) => {
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

app.delete('/:code', requireAuth, async (c) => {
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

export default app;
