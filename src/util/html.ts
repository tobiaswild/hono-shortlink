import type { Context } from 'hono';

export const wantsHtml = (c: Context) => {
  return (
    c.req.header('Accept')?.includes('text/html') ||
    c.req.header('User-Agent')?.includes('Mozilla')
  );
};
