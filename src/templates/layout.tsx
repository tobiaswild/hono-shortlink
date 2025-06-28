import { Style } from 'hono/css';
import { styles } from '../styles/main.js';

export default function Layout(props: { title: string; children: any }) {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{props.title}</title>
        <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
        <Style />
      </head>
      <body class={styles.body}>{props.children}</body>
    </html>
  );
}
