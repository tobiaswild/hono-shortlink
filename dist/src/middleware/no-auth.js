import { env } from '@/config/env.js';
import sessionStore from '@/db/store/session.js';
import { wantsHtml } from '@/util/html.js';
import { deleteCookie, getCookie } from 'hono/cookie';
export const requireNoAuth = async (c, next) => {
    const sessionId = getCookie(c, env.SESSION_COOKIE);
    if (sessionId === undefined) {
        await next();
        return;
    }
    const hasSession = await sessionStore.has(sessionId);
    if (!hasSession) {
        deleteCookie(c, env.SESSION_COOKIE);
        next();
        return;
    }
    const session = await sessionStore.get(sessionId);
    if (!session || session.expires < Date.now()) {
        deleteCookie(c, env.SESSION_COOKIE);
        next();
        return;
    }
    if (!wantsHtml(c)) {
        return c.json({
            success: false,
            code: 400,
            message: 'Already authenticated',
        }, 400);
    }
    return c.redirect('/admin/dashboard');
};
