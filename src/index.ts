import { serve } from '@hono/node-server';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { requestId } from 'hono/request-id';
import { secureHeaders } from 'hono/secure-headers';
import * as z from 'zod/v4';
import './db/db.js';
import urlStore from './urlStore.js';
import admin from './admin.js';

const app = new Hono();

app.use(requestId());
app.use(secureHeaders());
app.use(logger());
app.use(prettyJSON());
app.use(cors());
app.use(compress());

// Mount admin routes
app.route('/admin', admin);

// GET /:code - redirect to original URL
app.get(
  '/:code',
  zValidator(
    'param',
    z.object({
      code: z.string().refine((val) => val.length === 6, {
        error: 'code is 6 character long',
      }),
    }),
    (result, c) => {
      if (!result.success) {
        return c.text(z.prettifyError(result.error), 400);
      }
    }
  ),
  async (c) => {
    const code = c.req.param('code');

    const url = await urlStore.get(code);

    if (!url) {
      return c.text('Shortlink not found', 404);
    }

    return c.redirect(url);
  }
);

const server = serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

showRoutes(app, {
  verbose: false,
});

// Graceful shutdown handler
function gracefulShutdown(signal: string) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server has been closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);