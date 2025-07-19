import { Hono } from 'hono';
import shortlinkStore from '../db/store/shortlink.js';
import { requireAuth } from '../middleware/auth.js';
import DashboardPage from '../templates/dashboard.js';
import { getFlash } from '../util/flash.js';
import { getBaseUrl } from '../util/url.js';

const app = new Hono();

app.get('/', requireAuth, async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.redirect('/auth/login');
  }

  const shortlinks = await shortlinkStore.getAllByUserId(user.id);

  const flash = getFlash(c);

  return c.html(
    DashboardPage({
      shortlinks,
      baseUrl: getBaseUrl(c),
      user,
      flash,
    }),
  );
});

export default app;
