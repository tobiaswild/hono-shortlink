import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from '../utils/auth';

const app = new Hono();

app.use(
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

app.on(['POST', 'GET'], '*', (c) => {
  return auth.handler(c.req.raw);
});

export default app;
