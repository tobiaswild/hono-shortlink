import { Hono } from 'hono';
import loginRoutes from './login.js';
import logoutRoutes from './logout.js';
import registerRoutes from './register.js';

const app = new Hono();

app.route('/login', loginRoutes);
app.route('/logout', logoutRoutes);
app.route('/register', registerRoutes);

export default app;
