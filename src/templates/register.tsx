import { cx } from 'hono/css';
import { styles } from '@/styles/main.js';
import Layout from './layout.js';

export default function RegisterPage() {
  return (
    <Layout title="Register">
      <div class={styles.loginContainer}>
        <div class={styles.loginForm}>
          <h2 class={styles.loginFormH2}>📝 Register</h2>
          <form class="mt-8 space-y-6" action="/auth/register" method="post">
            <div class={styles.formGroup}>
              <label for="username" class={styles.formGroupLabel}>
                Username:
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                class={styles.formGroupInput}
                placeholder="Username"
              />
            </div>
            <div class={styles.formGroup}>
              <label for="email" class={styles.formGroupLabel}>
                Email address:
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                class={styles.formGroupInput}
                placeholder="Email address"
              />
            </div>
            <div class={styles.formGroup}>
              <label for="password" class={styles.formGroupLabel}>
                Password:
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                class={styles.formGroupInput}
                placeholder="Password"
              />
            </div>
            <div class={styles.formGroup}>
              <label for="confirmPassword" class={styles.formGroupLabel}>
                Confirm Password:
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                class={styles.formGroupInput}
                placeholder="Confirm Password"
              />
            </div>
            <button
              type="submit"
              class={cx(styles.btn, styles.btnPrimary, styles.btnFull)}
            >
              Create account
            </button>
          </form>
          <p class="mt-4 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a
              href="/auth/login"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </Layout>
  );
}
