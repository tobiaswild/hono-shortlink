import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';
import { html, raw } from 'hono/html';
import * as z from 'zod/v4';
import urlStore from './urlStore.js';
import { getCode } from './util/code.js';

// Admin API key - in production, use environment variable
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'your-secret-admin-key';

// Simple session management
const sessions = new Map<string, { isAdmin: boolean; expires: number }>();

// CSS Styles component
const Styles = () => html`
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f5f5f5;
      color: #333;
    }
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #f5f5f5;
    }
    .login-form {
      background: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 400px;
    }
    .login-form h2 {
      text-align: center;
      margin-bottom: 30px;
      color: #2563eb;
    }
    .form-group {
      margin-bottom: 15px;
    }
    .form-group label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    .form-group input {
      width: 100%;
      padding: 10px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      font-size: 16px;
    }
    .btn {
      padding: 4px 8px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 12px;
      color: white;
    }
    .btn:hover {
      opacity: 0.9;
    }
    .btn-primary {
      background: #2563eb;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 500;
    }
    .btn-primary:hover {
      background: #1d4ed8;
    }
    .btn-full {
      width: 100%;
    }
    .btn-danger {
      background: #dc2626;
    }
    .btn-danger:hover {
      background: #b91c1c;
    }
    .btn-logout {
      margin-top: 10px;
    }
    .copy-btn {
      background: #059669;
    }
    .copy-btn:hover {
      background: #047857;
    }
    .delete-btn {
      background: #dc2626;
    }
    .delete-btn:hover {
      background: #b91c1c;
    }
    .open-btn {
      background: #2563eb;
    }
    .open-btn:hover {
      background: #1d4ed8;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    .header h1 {
      color: #2563eb;
      margin-bottom: 10px;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .stat-card {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: #2563eb;
    }
    .stat-label {
      color: #666;
      margin-top: 5px;
    }
    .section {
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    .section h2 {
      color: #2563eb;
      margin-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
    }
    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    .table th,
    .table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    .table th {
      background: #f9fafb;
      font-weight: 600;
    }
    .table tr:hover {
      background: #f9fafb;
    }
    .shortlink-code {
      font-family: monospace;
      background: #f3f4f6;
      padding: 4px 8px;
      border-radius: 4px;
      color: #dc2626;
    }
    .shortlink-url {
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .alert {
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 15px;
    }
    .alert-success {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }
    .alert-error {
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
    }
    .info {
      text-align: center;
      color: #666;
      margin-top: 20px;
      font-size: 14px;
    }
  </style>
`;

// Layout component
const Layout = (props: { title: string; children: any }) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${props.title}</title>
      <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
      ${Styles()}
    </head>
    <body>
      ${props.children}
    </body>
  </html>
`;

// Login Page component
const LoginPage = () => html`
  <div class="login-container">
    <div class="login-form">
      <h2>🔐 Admin Login</h2>
      <form id="loginForm">
        <div class="form-group">
          <label for="apiKey">API Key:</label>
          <input
            type="password"
            id="apiKey"
            name="apiKey"
            placeholder="Enter your admin API key"
            required
          />
        </div>
        <button type="submit" class="btn btn-primary btn-full">Login</button>
      </form>
      <div id="loginResult"></div>
      <div class="info">
        <p>Default API Key: <code>your-secret-admin-key</code></p>
        <p>Set ADMIN_API_KEY environment variable to customize</p>
      </div>
    </div>
  </div>

  <script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const apiKey = formData.get('apiKey');

      const resultDiv = document.getElementById('loginResult');

      try {
        const response = await fetch('/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ apiKey }),
        });

        if (response.ok) {
          window.location.href = '/admin';
        } else {
          resultDiv.innerHTML = \`
                    <div class="alert alert-error">
                        ❌ Invalid API key
                    </div>
                \`;
        }
      } catch (error) {
        resultDiv.innerHTML = \`
                <div class="alert alert-error">
                    ❌ Error: \${error.message}
                </div>
            \`;
      }
    });
  </script>
`;

// Dashboard Scripts component
const DashboardScripts = () => html`
  <script>
    document.getElementById('createForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = formData.get('url');
      const customCode = formData.get('customCode');

      const resultDiv = document.getElementById('createResult');

      try {
        const response = await fetch('/admin/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url, customCode: customCode || undefined }),
        });

        const result = await response.json();

        if (response.ok) {
          resultDiv.innerHTML = \`
                    <div class="alert alert-success">
                        ✅ Shortlink created successfully! 
                        <a href="\${result.short}" target="_blank">\${result.short}</a>
                    </div>
                \`;
          e.target.reset();
          // Reload page to show new shortlink
          setTimeout(() => location.reload(), 1500);
        } else {
          resultDiv.innerHTML = \`
                    <div class="alert alert-error">
                        ❌ Error: \${result.error || 'Failed to create shortlink'}
                    </div>
                \`;
        }
      } catch (error) {
        resultDiv.innerHTML = \`
                <div class="alert alert-error">
                    ❌ Error: \${error.message}
                </div>
            \`;
      }
    });

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        // Show a brief success message
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        btn.style.background = '#059669';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '#059669';
        }, 1000);
      });
    }

    function deleteShortlink(code) {
      if (confirm('Are you sure you want to delete this shortlink?')) {
        fetch('/admin/delete/' + code, {
          method: 'DELETE',
        })
          .then((response) => {
            if (response.ok) {
              location.reload();
            } else {
              alert('Failed to delete shortlink');
            }
          })
          .catch((error) => {
            console.error('Error deleting shortlink:', error);
            alert('An error occurred while deleting the shortlink');
          });
      }
    }

    function openShortlink(url) {
      window.open(url, '_blank');
    }

    async function logout() {
      try {
        await fetch('/admin/logout', { method: 'POST' });
        window.location.href = '/admin';
      } catch (error) {
        console.error('Error logging out:', error);
        window.location.href = '/admin';
      }
    }
  </script>
`;

// Dashboard Page component
const DashboardPage = (props: { shortlinks: any[]; baseUrl: string }) => html`
  <div class="container">
    <div class="header">
      <h1>🔗 Shortlink Admin Dashboard</h1>
      <p>Manage your shortlinks and create new ones</p>
      <button onclick="logout()" class="btn btn-danger btn-logout">Logout</button>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-number">${props.shortlinks.length}</div>
        <div class="stat-label">Total Shortlinks</div>
      </div>
    </div>

    <div class="section">
      <h2>➕ Create New Shortlink</h2>
      <form id="createForm">
        <div class="form-group">
          <label for="url">Target URL:</label>
          <input type="url" id="url" name="url" placeholder="https://example.com" required />
        </div>
        <div class="form-group">
          <label for="customCode">Custom Code (optional, 6 characters):</label>
          <input
            type="text"
            id="customCode"
            name="customCode"
            placeholder="Leave empty for auto-generated"
            maxlength="6"
            pattern="[A-Za-z0-9]{6}"
          />
        </div>
        <button type="submit" class="btn btn-primary">Create Shortlink</button>
      </form>
      <div id="createResult"></div>
    </div>

    <div class="section">
      <h2>📋 All Shortlinks</h2>
      <table class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Target URL</th>
            <th>Short URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${raw(props.shortlinks
            .map(
              (link) => `
              <tr>
                  <td>${link.id}</td>
                  <td><span class="shortlink-code">${link.code}</span></td>
                  <td class="shortlink-url" title="${link.url}">${link.url}</td>
                  <td class="shortlink-url" title="${props.baseUrl}/${link.code}">
                    ${props.baseUrl}/${link.code}
                  </td>
                  <td>
                    <button
                      class="btn open-btn"
                      onclick="openShortlink('${props.baseUrl}/${link.code}')"
                    >
                      Open
                    </button>
                    <button
                      class="btn copy-btn"
                      onclick="copyToClipboard('${props.baseUrl}/${link.code}')"
                    >
                      Copy
                    </button>
                    <button class="btn delete-btn" onclick="deleteShortlink('${link.code}')">
                      Delete
                    </button>
                  </td>
              </tr>
              `
            )
            .join(''))}
        </tbody>
      </table>
    </div>
  </div>

  ${DashboardScripts()}
`;

// Middleware to check admin authentication
const requireAdminAuth = async (c: any, next: any) => {
  const sessionId = getCookie(c, 'admin_session');

  if (!sessionId || !sessions.has(sessionId)) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const session = sessions.get(sessionId);
  if (!session || !session.isAdmin || session.expires < Date.now()) {
    sessions.delete(sessionId);
    setCookie(c, 'admin_session', '', { maxAge: 0, path: '/' });
    return c.json({ error: 'Session expired' }, 401);
  }

  await next();
};

// Helper function to check if request is for HTML
const wantsHtml = (c: any) => {
  return (
    c.req.header('Accept')?.includes('text/html') || c.req.header('User-Agent')?.includes('Mozilla')
  );
};

const app = new Hono();

// Login route
app.post('/login', async (c) => {
  const body = await c.req.json();
  const { apiKey } = body;

  if (apiKey !== ADMIN_API_KEY) {
    return c.json({ error: 'Invalid API key' }, 401);
  }

  // Create session
  const sessionId = crypto.randomUUID();
  const expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  sessions.set(sessionId, { isAdmin: true, expires });

  // Set session cookie
  setCookie(c, 'admin_session', sessionId, { maxAge: 86400, path: '/', sameSite: 'Lax' });

  return c.json({ success: true });
});

// Logout route
app.post('/logout', async (c) => {
  const sessionId = getCookie(c, 'admin_session');
  if (sessionId) {
    sessions.delete(sessionId);
  }
  setCookie(c, 'admin_session', '', { maxAge: 0, path: '/' });
  return c.json({ success: true });
});

// Main admin dashboard
app.get('/', async (c) => {
  const sessionId = getCookie(c, 'admin_session');
  const isAuthenticated = sessionId && sessions.has(sessionId);

  // If not authenticated and it's a browser request, show login page
  if (!isAuthenticated && wantsHtml(c)) {
    const html = Layout({ title: 'Shortlink Admin Login', children: LoginPage() });
    return c.html(html);
  }

  // If not authenticated, return error
  if (!isAuthenticated) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  // If authenticated, show the dashboard
  const shortlinks = await urlStore.getAll();

  const html = Layout({
    title: 'Shortlink Admin Dashboard',
    children: DashboardPage({ shortlinks, baseUrl: c.req.url.split('/').slice(0, 3).join('/') }),
  });

  return c.html(html);
});

// Create shortlink route
app.post(
  '/create',
  requireAdminAuth,
  zValidator(
    'json',
    z.object({
      url: z.url(),
      customCode: z.string().length(6).optional(),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json({ error: z.prettifyError(result.error) }, 400);
      }
    }
  ),
  async (c) => {
    const body = c.req.valid('json');
    const { url, customCode } = body;

    try {
      let code: string;

      if (customCode) {
        // Check if custom code already exists
        const exists = await urlStore.has(customCode);
        if (exists) {
          return c.json({ error: 'Custom code already exists' }, 400);
        }
        code = customCode;
      } else {
        code = await getCode();
      }

      await urlStore.set(code, url);

      const shortUrl = `${c.req.url.split('/').slice(0, 3).join('/')}/${code}`;

      return c.json({ short: shortUrl });
    } catch (error) {
      return c.json({ error: 'Failed to create shortlink' }, 500);
    }
  }
);

// Delete shortlink route
app.delete(
  '/delete/:code',
  requireAdminAuth,
  zValidator(
    'param',
    z.object({
      code: z.string().length(6),
    }),
    (result, c) => {
      if (!result.success) {
        return c.json({ error: z.prettifyError(result.error) }, 400);
      }
    }
  ),
  async (c) => {
    const { code } = c.req.valid('param');

    try {
      const deleted = await urlStore.delete(code);

      if (!deleted) {
        return c.json({ error: 'Shortlink not found' }, 404);
      }

      return c.json({ success: true, message: 'Shortlink deleted successfully' });
    } catch (error) {
      return c.json({ error: 'Failed to delete shortlink' }, 500);
    }
  }
);

export default app;
