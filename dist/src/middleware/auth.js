import { env } from '@/config/env.js';
import sessionStore from '@/db/store/session.js';
import userStore from '@/db/store/user.js';
import { wantsHtml } from '@/util/html.js';
import { deleteCookie, getCookie } from 'hono/cookie';
export const requireAuth = async (c, next) => {
    const sessionId = getCookie(c, env.SESSION_COOKIE);
    if (!sessionId) {
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 401,
                message: 'Unauthorized',
            }, 401);
        }
        return c.redirect('/admin/login');
    }
    const hasSession = await sessionStore.has(sessionId);
    if (!hasSession) {
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 401,
                message: 'Session invalid',
            }, 401);
        }
        return c.redirect('/admin/login');
    }
    const session = await sessionStore.get(sessionId);
    if (!session) {
        sessionStore.delete(sessionId);
        deleteCookie(c, env.SESSION_COOKIE);
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 401,
                message: 'Session invalid',
            }, 401);
        }
        return c.redirect('/admin/login');
    }
    if (session.expires < Date.now()) {
        sessionStore.delete(sessionId);
        deleteCookie(c, env.SESSION_COOKIE);
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 401,
                message: 'Session expired',
            }, 401);
        }
        return c.redirect('/admin/login');
    }
    // Get user information
    const user = await userStore.getById(session.userId);
    if (!user) {
        sessionStore.delete(sessionId);
        deleteCookie(c, env.SESSION_COOKIE);
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 401,
                message: 'User not found',
            }, 401);
        }
        return c.redirect('/admin/login');
    }
    // Add user to context
    c.set('user', user);
    await next();
};
