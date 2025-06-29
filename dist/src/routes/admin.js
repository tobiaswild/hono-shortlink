import { env } from '@/config/env.js';
import sessionStore from '@/db/store/session.js';
import urlStore from '@/db/store/shortlink.js';
import userStore from '@/db/store/user.js';
import { requireAuth } from '@/middleware/auth.js';
import { requireNoAuth } from '@/middleware/no-auth.js';
import DashboardPage from '@/templates/dashboard.js';
import LoginPage from '@/templates/login.js';
import RegisterPage from '@/templates/register.js';
import { getCode } from '@/util/code.js';
import { wantsHtml } from '@/util/html.js';
import { hashPassword, verifyPassword } from '@/util/password.js';
import { getBaseUrl } from '@/util/url.js';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import * as z from 'zod/v4';
const app = new Hono();
app.get('/dashboard', requireAuth, async (c) => {
    const user = c.get('user');
    const shortlinks = await urlStore.getAllByUserId(user.id);
    if (!wantsHtml(c)) {
        return c.json({
            success: true,
            code: 200,
            data: shortlinks,
        }, 200);
    }
    return c.html(DashboardPage({ shortlinks, baseUrl: getBaseUrl(c), user }));
});
app.get('/login', requireNoAuth, (c) => {
    if (!wantsHtml(c)) {
        return c.json({
            success: false,
            code: 400,
            message: 'login via post',
        }, 400);
    }
    return c.html(LoginPage());
});
app.get('/register', requireNoAuth, (c) => {
    if (!wantsHtml(c)) {
        return c.json({
            success: false,
            code: 400,
            message: 'register via post',
        }, 400);
    }
    return c.html(RegisterPage());
});
app.post('/register', requireNoAuth, async (c) => {
    const formData = await c.req.formData();
    const username = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    if (!username || !email || !password) {
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 400,
                error: 'All fields are required',
            }, 400);
        }
        return c.redirect('/admin/register');
    }
    // Check if username already exists
    const existingUser = await userStore.getByUsername(username);
    if (existingUser) {
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 400,
                error: 'Username already exists',
            }, 400);
        }
        return c.redirect('/admin/register');
    }
    // Check if email already exists
    const existingEmail = await userStore.getByEmail(email);
    if (existingEmail) {
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 400,
                error: 'Email already exists',
            }, 400);
        }
        return c.redirect('/admin/register');
    }
    try {
        const passwordHash = await hashPassword(password);
        await userStore.create(username, email, passwordHash);
        if (!wantsHtml(c)) {
            return c.json({
                success: true,
                code: 200,
                message: 'User created successfully',
            });
        }
        return c.redirect('/admin/login');
    }
    catch (error) {
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 500,
                error: 'Failed to create user',
            }, 500);
        }
        return c.redirect('/admin/register');
    }
});
app.post('/login', requireNoAuth, async (c) => {
    const formData = await c.req.formData();
    const username = formData.get('username');
    const password = formData.get('password');
    if (!username || !password) {
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 400,
                error: 'Username and password are required',
            }, 400);
        }
        return c.redirect('/admin/login');
    }
    const user = await userStore.getByUsername(username);
    if (!user) {
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 401,
                error: 'Invalid credentials',
            }, 401);
        }
        return c.redirect('/admin/login');
    }
    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 401,
                error: 'Invalid credentials',
            }, 401);
        }
        return c.redirect('/admin/login');
    }
    const sessionId = crypto.randomUUID();
    const expires = Date.now() + 24 * 60 * 60 * 1000;
    sessionStore.set(sessionId, user.id, expires);
    setCookie(c, env.SESSION_COOKIE, sessionId, { maxAge: 86400, path: '/', sameSite: 'Lax' });
    if (!wantsHtml(c)) {
        return c.json({
            success: true,
            code: 200,
            message: 'logged in',
        });
    }
    return c.redirect('/admin/dashboard');
});
app.post('/logout', requireAuth, async (c) => {
    const sessionId = getCookie(c, env.SESSION_COOKIE);
    if (sessionId) {
        sessionStore.delete(sessionId);
    }
    setCookie(c, env.SESSION_COOKIE, '', { maxAge: 0, path: '/' });
    if (!wantsHtml(c)) {
        return c.json({ success: true, code: 200, message: 'you got signed out' }, 200);
    }
    return c.redirect('/admin/login');
});
app.post('/create', requireAuth, zValidator('form', z.object({
    url: z.url(),
    customCode: z.string().length(6).optional(),
}), (result, c) => {
    if (!result.success) {
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 400,
                error: JSON.parse(result.error.message),
            }, 400);
        }
        return c.redirect('/admin/dashboard');
    }
}), async (c) => {
    const body = c.req.valid('form');
    const { url, customCode } = body;
    const user = c.get('user');
    try {
        let code;
        if (customCode) {
            const exists = await urlStore.has(customCode);
            if (exists) {
                if (!wantsHtml(c)) {
                    return c.json({
                        success: false,
                        code: 400,
                        error: 'Custom code already exists',
                    }, 400);
                }
                return c.redirect('/admin/dashboard');
            }
            code = customCode;
        }
        else {
            code = await getCode();
        }
        await urlStore.set(code, url, user.id);
        const shortUrl = `${getBaseUrl(c)}/${code}`;
        if (!wantsHtml(c)) {
            return c.json({ success: true, code: 200, short: shortUrl });
        }
        return c.redirect('/admin/dashboard');
    }
    catch (error) {
        if (!wantsHtml(c)) {
            return c.json({ success: false, code: 500, error: 'Failed to create shortlink' }, 500);
        }
        return c.redirect('/admin/dashboard');
    }
});
app.post('/delete/:code', requireAuth, zValidator('param', z.object({
    code: z.string(),
}), (result, c) => {
    if (!result.success) {
        if (!wantsHtml(c)) {
            return c.json({
                success: false,
                code: 400,
                error: JSON.parse(result.error.message),
            }, 400);
        }
        return c.redirect('/admin/dashboard');
    }
}), async (c) => {
    const { code } = c.req.valid('param');
    const user = c.get('user');
    try {
        const deleted = await urlStore.deleteByUserId(code, user.id);
        if (!deleted) {
            if (!wantsHtml(c)) {
                return c.json({
                    success: false,
                    code: 404,
                    error: 'Shortlink not found or not owned by you',
                }, 404);
            }
            return c.redirect('/admin/dashboard');
        }
        if (!wantsHtml(c)) {
            return c.json({ success: true, code: 200, message: 'Shortlink deleted' });
        }
        return c.redirect('/admin/dashboard');
    }
    catch (error) {
        if (!wantsHtml(c)) {
            return c.json({ success: false, code: 500, error: 'Failed to delete shortlink' }, 500);
        }
        return c.redirect('/admin/dashboard');
    }
});
export default app;
