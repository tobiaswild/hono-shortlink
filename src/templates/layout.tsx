import { css, Style } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';
import { APP_CONFIG } from '@/config/app.js';

export default function Layout({
  children,
  title,
}: PropsWithChildren<{ title: string }>) {
  const styles = {
    reset: css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`,
    body: css`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
  color: #333;
`,
  };

  return (
    <html lang="en" class={styles.reset}>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>
          {title} - {APP_CONFIG.APP_NAME}
        </title>
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <Style />
      </head>
      <body class={styles.body}>{children}</body>
    </html>
  );
}
