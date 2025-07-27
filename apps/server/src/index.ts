import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { showRoutes } from 'hono/dev';
import { logger } from 'hono/logger';
import { env } from './config/env';
import { globalErrorHandler } from './middleware/error-handlers';
import authRoutes from './routes/auth';
import redirectRoutes from './routes/redirect';
import shortlinksRoutes from './routes/shortlinks';

const app = new Hono();

app.use(logger());

app.onError(globalErrorHandler);

app.route('/redirect', redirectRoutes);

const api = new Hono();

api.onError(globalErrorHandler);

api.use(
  '*',
  cors({
    origin: 'http://localhost:5173',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length'],
    maxAge: 600,
    credentials: true,
  }),
);

api.route('/auth', authRoutes);

api.route('/shortlinks', shortlinksRoutes);

app.route('/api', api);

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
