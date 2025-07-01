import { Hono } from 'hono';
import { APP_CONFIG } from '@/config/app.js';
import sessionStore from '@/db/store/session.js';
import userStore from '@/db/store/user.js';
import LoginPage from '@/templates/login.js';
import { getFlash, setFlash } from '@/util/flash.js';
import { verifyPassword } from '@/util/password.js';
import { setSession } from '@/util/session.js';

const app = new Hono();

app.get('/', (c) => {
  const flash = getFlash(c);

  console.log(flash);

  return c.html(LoginPage({ flash }));
});

app.post('/', async (c) => {
  const formData = await c.req.formData();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    setFlash(c, 'Username and password are required');

    return c.redirect('/auth/login');
  }

  const user = await userStore.getByUsername(username);
  if (!user) {
    setFlash(c, 'Invalid username or password');

    return c.redirect('/auth/login');
  }

  const isValidPassword = await verifyPassword(password, user.passwordHash);
  if (!isValidPassword) {
    setFlash(c, 'Invalid username or password');

    return c.redirect('/auth/login');
  }

  const sessionId = crypto.randomUUID();
  const expires = Date.now() + APP_CONFIG.SESSION_MAX_AGE;
  await sessionStore.set(sessionId, user.id, expires);

  setSession(c, sessionId);

  return c.redirect('/dashboard');
});

export default app;
