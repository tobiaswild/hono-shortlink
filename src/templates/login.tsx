import { cx } from 'hono/css';
import { styles } from '../styles/main.js';
import Layout from './layout.js';

export default function LoginPage() {
  return (
    <Layout title="test">
      <div class={styles.loginContainer}>
      <div class={styles.loginForm}>
        <h2 class={styles.loginFormH2}>🔐 Admin Login</h2>
        <form id="loginForm">
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
        <div id="loginResult"></div>
        <div class={styles.info}>
          <p>
            Default API Key: <code>your-secret-admin-key</code>
          </p>
          <p>Set ADMIN_API_KEY environment variable to customize</p>
        </div>
      </div>
      </div>
    </Layout>
  );
}
