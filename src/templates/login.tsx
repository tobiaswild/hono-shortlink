import { styles } from '@/styles/main.js';
import { cx } from 'hono/css';
import Layout from './layout.js';

export default function LoginPage() {
  return (
    <Layout title="Shortlink Admin Login">
      <div class={styles.loginContainer}>
        <div class={styles.loginForm}>
          <h2 class={styles.loginFormH2}>🔐 Admin Login</h2>
          <form id="loginForm" method="post" action="/admin/login">
            <div class={styles.formGroup}>
              <label for="apiKey" class={styles.formGroupLabel}>
                API Key:
              </label>
              <input
                type="password"
                id="apiKey"
                name="apiKey"
                placeholder="Enter your admin API key"
                required
                class={styles.formGroupInput}
              />
            </div>
            <button type="submit" class={cx(styles.btn, styles.btnPrimary, styles.btnFull)}>
              Login
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
