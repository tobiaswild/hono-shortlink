import { env } from './config/env.js';

import authRoutes from './routes/auth/index.js';
import shortlinksRoutes from './routes/shortlinks.js';
import './types/context.js';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import type { ApiMessageResponse } from '@repo/types';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';

const app = new Hono();

app.use(logger());
app.use(cors());

app.use('/static/*', serveStatic({ root: './' }));
app.use('/favicon.ico', serveStatic({ path: './static/favicon.svg' }));

app.route('/auth', authRoutes);
app.route('/shortlinks', shortlinksRoutes);

app.get('/hello', async (c) => {
  return c.json<ApiMessageResponse>({
    message: 'Hello BHVR!',
    success: true,
  });
});

showRoutes(app);

const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

process.on('SIGINT', () => {
  server.close();
  process.exit(0);
});
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    process.exit(0);
  });
});
