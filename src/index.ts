import { env } from '@/config/env.js';
import urlStore from '@/db/store/shortlink.js';
import admin from '@/routes/admin.js';
import ErrorPage from '@/templates/error.js';
import NotFoundPage from '@/templates/not-found.js';
import '@/types/context.js';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';

const app = new Hono();

app.use(requestId());
app.use(secureHeaders());
app.use(logger());
app.use(prettyJSON());
app.use(cors());
app.use(compress());

app.use('/static/*', serveStatic({ root: './' }));
app.use('/favicon.ico', serveStatic({ path: './static/favicon.svg' }));

app.route('/admin', admin);

app.get('/:code', async (c) => {
  const code = c.req.param('code');

  const url = await urlStore.get(code);

  if (!url) {
    return c.html(NotFoundPage());
  }

  return c.redirect(url);
});

app.notFound((c) => {
  return c.html(NotFoundPage());
});

app.onError((err, c) => {
  console.error(`${err}`);

  return c.html(ErrorPage());
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
