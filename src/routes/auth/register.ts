import { Hono } from 'hono';
import { APP_CONFIG } from '@/config/app.js';
import sessionStore from '@/db/store/session.js';
import userStore from '@/db/store/user.js';
import RegisterPage from '@/templates/register.js';
import { getFlash, setFlash } from '@/util/flash.js';
import { hashPassword } from '@/util/password.js';
import { setSession } from '@/util/session.js';

const app = new Hono();

app.get('/', (c) => {
  const flash = getFlash(c);

  return c.html(RegisterPage({ flash }));
});

app.post('/', async (c) => {
  const formData = await c.req.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!username || !password || !confirmPassword) {
    setFlash(c, 'Username and password are required');

    return c.redirect('/auth/register');
  }

  if (password !== confirmPassword) {
    setFlash(c, 'Passwords do not match');

    return c.redirect('/auth/register');
  }

  if (password.length < 6) {
    setFlash(c, 'Password must be at least 6 characters long');

    return c.redirect('/auth/register');
  }

  const existingUser = await userStore.getByUsername(username);
  if (existingUser) {
    setFlash(c, 'Username already exists');

    return c.redirect('/auth/register');
  }

  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    setFlash(c, 'Invalid email address');

    return c.redirect('/auth/register');
  }

  const hashedPassword = await hashPassword(password);
  const _result = await userStore.create(username, email, hashedPassword);

  const newUser = await userStore.getByUsername(username);
  if (!newUser) {
    setFlash(c, 'Failed to create user');

    return c.redirect('/auth/register');
  }

  const sessionId = crypto.randomUUID();
  const expires = Date.now() + APP_CONFIG.SESSION_MAX_AGE;
  await sessionStore.set(sessionId, newUser.id, expires);

  setSession(c, sessionId);

  return c.redirect('/dashboard');
});

export default app;
