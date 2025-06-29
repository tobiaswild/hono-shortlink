import { styles } from '@/styles/main.js';
import { cx } from 'hono/css';
import Layout from './layout.js';

export default function LoginPage() {
  return (
    <Layout title="Admin Login">
      <div class={styles.loginContainer}>
        <div class={styles.loginForm}>
          <h2 class={styles.loginFormH2}>🔐 Admin Login</h2>
          <form id="loginForm" method="post" action="/admin/login">
            <div class={styles.formGroup}>
              <label for="username" class={styles.formGroupLabel}>
                Username:
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                required
                class={styles.formGroupInput}
              />
            </div>
            <div class={styles.formGroup}>
              <label for="password" class={styles.formGroupLabel}>
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                required
                class={styles.formGroupInput}
              />
            </div>
            <button type="submit" class={cx(styles.btn, styles.btnPrimary, styles.btnFull)}>
              Login
            </button>
          </form>
          <p class="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/admin/register" class="font-medium text-indigo-600 hover:text-indigo-500">
              Create one here
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
