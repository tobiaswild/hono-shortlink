import { Hono } from 'hono';
import shortlinkStore from '@/db/store/shortlink.js';
import { requireAuth } from '@/middleware/auth.js';
import { getCode } from '@/util/code.js';
import { setFlash } from '@/util/flash.js';

const app = new Hono();

app.post('/', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/auth/login');
  }
  const formData = await c.req.formData();
  const url = formData.get('url') as string;
  const customCode = formData.get('customCode') as string;

  if (!url) {
    setFlash(c, 'URL is required');

    return c.redirect('/dashboard');
  }

  let code = customCode;

  if (!customCode) {
    try {
      code = await getCode();
    } catch (err) {
      console.error(err);

      setFlash(c, 'Failed to create shortlink');

      return c.redirect('/dashboard');
    }
  }

  try {
    await shortlinkStore.set(code, url, user.id);
  } catch (err) {
    if (err instanceof Error) {
      setFlash(c, err.message);
    } else {
      setFlash(c, 'an error occured');
    }

    return c.redirect('/dashboard');
  }

  setFlash(c, 'Shortlink created');

  return c.redirect('/dashboard');
});

app.post('/:code/delete', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/auth/login');
  }
  const code = c.req.param('code');

  const shortlinkUrl = await shortlinkStore.get(code);
  if (!shortlinkUrl) {
    setFlash(c, 'Shortlink not found');

    return c.redirect('/dashboard');
  }

  const deleted = await shortlinkStore.deleteByUserId(code, user.id);
  if (!deleted) {
    setFlash(c, 'Failed to delete shortlink');

    return c.redirect('/dashboard');
  }

  setFlash(c, 'Shortlink deleted');

  return c.redirect('/dashboard');
});

export default app;
