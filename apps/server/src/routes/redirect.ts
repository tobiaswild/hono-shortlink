import { zValidator } from '@hono/zod-validator';
import { paramShortlinkSchema } from '@repo/schemas';
import { Hono } from 'hono';
import { ShortlinkStore } from '../store/shortlink';

const app = new Hono();

app.get('/:code', zValidator('param', paramShortlinkSchema), async (c) => {
  const params = c.req.valid('param');
  const code = params.code;

  const shortlink = await ShortlinkStore.get(code);

  if (!shortlink) {
    return c.notFound();
  }

  return c.redirect(shortlink?.url);
});

export default app;
