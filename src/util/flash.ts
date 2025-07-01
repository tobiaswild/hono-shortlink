import type { Context } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';

export const setFlash = (c: Context, message: string) => {
  setCookie(c, 'flash', message, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 5,
  });
};

export const getFlash = (c: Context) => {
  return deleteCookie(c, 'flash');
};
