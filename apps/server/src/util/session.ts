import type { Context } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { APP_CONFIG } from '../config/app.js';

export const setSession = (c: Context, sessionId: string) => {
  setCookie(c, APP_CONFIG.SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: APP_CONFIG.SESSION_MAX_AGE / 1000,
  });
};

export const deleteSession = (c: Context) => {
  deleteCookie(c, APP_CONFIG.SESSION_COOKIE);
};

export const getSession = (c: Context) => {
  return getCookie(c, APP_CONFIG.SESSION_COOKIE);
};
