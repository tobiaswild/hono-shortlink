import { cx } from 'hono/css';
import { styles } from '@/styles/main.js';
import Layout from './layout.js';

export default function LoginPage({ flash }: { flash?: string }) {
  return (
    <Layout title="Admin Login">
      <div class={styles.loginContainer}>
        <div class={styles.loginForm}>
          <h2 class={styles.loginFormH2}>🔐 Admin Login</h2>
          {flash && <p class="text-red-500">{flash}</p>}
          <form id="loginForm" method="post" action="/auth/login">
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
            <button
              type="submit"
              class={cx(styles.btn, styles.btnPrimary, styles.btnFull)}
            >
              Login
            </button>
          </form>
          <p class="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/auth/register"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Create one here
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
