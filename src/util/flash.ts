import type { Context } from 'hono';
import { deleteCookie, setCookie } from 'hono/cookie';

export const setFlash = (c: Context, flash: Flash) => {
  setCookie(c, 'flash', JSON.stringify(flash), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 5,
  });
};

export const getFlash = (c: Context) => {
  const flash = deleteCookie(c, 'flash');

  if (!flash) {
    return undefined;
  }

  return JSON.parse(flash) as Flash;
};

export type FlashType = 'success' | 'error' | 'neutral';

export type Flash = {
  type: FlashType;
  message: string;
};
