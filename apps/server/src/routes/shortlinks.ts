import { Hono } from 'hono';
import shortlinkStore from '../db/store/shortlink.js';
import { requireAuth } from '../middleware/auth.js';
import { getCode } from '../util/code.js';

const app = new Hono();

app.post('/', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json(
      {
        success: false,
        message: 'an error occured',
      },
      400,
    );
  }
  const formData = await c.req.formData();
  const url = formData.get('url') as string;
  const customCode = formData.get('customCode') as string;

  if (!url) {
    return c.json({
      type: 'error',
      message: 'URL is required',
    });
  }

  let code = customCode;

  if (!customCode) {
    try {
      code = await getCode();
    } catch (err) {
      console.error(err);

      return c.json({
        type: 'error',
        message: 'Failed to create shortlink',
      });
    }
  }

  try {
    await shortlinkStore.set(code, url, user.id);
  } catch (err) {
    if (err instanceof Error) {
      return c.json({
        type: 'error',
        message: err.message,
      });
    } else {
      return c.json({
        type: 'error',
        message: 'an error occured',
      });
    }
  }

  return c.json({
    type: 'success',
    message: 'Shortlink created',
  });
});

app.post('/:code/delete', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ success: false });
  }
  const code = c.req.param('code');

  const shortlinkUrl = await shortlinkStore.get(code);
  if (!shortlinkUrl) {
    return c.json({
      type: 'error',
      message: 'Shortlink not found',
    });
  }

  const deleted = await shortlinkStore.deleteByUserId(code, user.id);
  if (!deleted) {
    return c.json({
      type: 'error',
      message: 'Failed to delete shortlink',
    });
  }

  return c.json({
    type: 'error',
    message: 'Shortlink deleted',
  });
});

export default app;
