import { cx } from 'hono/css';
import type { Shortlink } from '@/db/types/shortlink.js';
import { styles } from '@/styles/main.js';
import Layout from '@/templates/layout.js';

export default function DashboardPage(props: {
  shortlinks: Shortlink[];
  baseUrl: string;
  user: { username: string; email: string };
}) {
  return (
    <Layout title="Admin Dashboard">
      <div class={styles.container}>
        <div class={styles.header}>
          <h1 class={styles.headerH1}>🔗 Admin Dashboard</h1>
          <p>
            Welcome, {props.user.username}! Manage your shortlinks and create
            new ones
          </p>
          <div class="flex gap-2">
            <span class="text-sm text-gray-600">
              Logged in as: {props.user.email}
            </span>
            <form method="post" action="/admin/logout" class={styles.formReset}>
              <button type="submit" class={cx(styles.btn, styles.btnDanger)}>
                Logout
              </button>
            </form>
          </div>
        </div>

        <div class={styles.stats}>
          <div class={styles.statCard}>
            <div class={styles.statNumber}>{props.shortlinks.length}</div>
            <div class={styles.statLabel}>Your Shortlinks</div>
          </div>
        </div>

        <div class={styles.section}>
          <h2 class={styles.sectionH2}>➕ Create New Shortlink</h2>
          <form id="createForm" method="post" action="/admin/shortlinks">
            <div class={styles.formGroup}>
              <label for="url" class={styles.formGroupLabel}>
                Target URL:
              </label>
              <input
                type="url"
                id="url"
                name="url"
                placeholder="https://example.com"
                required
                class={styles.formGroupInput}
              />
            </div>
            <div class={styles.formGroup}>
              <label for="customCode" class={styles.formGroupLabel}>
                Custom Code (optional, 6 characters):
              </label>
              <input
                type="text"
                id="customCode"
                name="customCode"
                placeholder="Leave empty for auto-generated"
                maxlength={6}
                pattern="[A-Za-z0-9]{6}"
                class={styles.formGroupInput}
              />
            </div>
            <button type="submit" class={cx(styles.btn, styles.btnPrimary)}>
              Create Shortlink
            </button>
          </form>
          <div id="createResult"></div>
        </div>

        <div class={styles.section}>
          <h2 class={styles.sectionH2}>📋 Your Shortlinks</h2>
          <table class={styles.table}>
            <thead>
              <tr>
                <th class={styles.tableTh}>ID</th>
                <th class={styles.tableTh}>Code</th>
                <th class={styles.tableTh}>Target URL</th>
                <th class={styles.tableTh}>Short URL</th>
                <th class={styles.tableTh}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {props.shortlinks.map((link) => (
                <tr>
                  <td class={styles.tableTd}>{link.id}</td>
                  <td class={styles.tableTd}>
                    <span class={styles.shortlinkCode}>{link.code}</span>
                  </td>
                  <td
                    class={cx(styles.tableTd, styles.shortlinkUrl)}
                    title={link.url}
                  >
                    {link.url}
                  </td>
                  <td
                    class={cx(styles.tableTd, styles.shortlinkUrl)}
                    title={`${props.baseUrl}/${link.code}`}
                  >
                    {props.baseUrl}/{link.code}
                  </td>
                  <td class={cx(styles.tableTd, styles.buttons)}>
                    <a
                      class={cx(styles.linkReset, styles.btn, styles.openBtn)}
                      href={`${props.baseUrl}/${link.code}`}
                      target={'_blank'}
                    >
                      Open
                    </a>

                    <button
                      type="button"
                      class={cx(styles.btn, styles.deleteBtn)}
                      data-code={link.code}
                      onclick="deleteShortlink(this.dataset.code)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <script>
        {`
          async function deleteShortlink(code) {
            if (confirm('Are you sure you want to delete this shortlink?')) {
              try {
                const response = await fetch(\`/admin/shortlinks/\${code}\`, {
                  method: 'DELETE',
                });
                if (response.ok) {
                  window.location.reload();
                } else {
                  alert('Failed to delete shortlink');
                }
              } catch (error) {
                alert('Error deleting shortlink');
              }
            }
          }
        `}
      </script>
    </Layout>
  );
}
