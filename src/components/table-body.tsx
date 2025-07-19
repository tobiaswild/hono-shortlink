import { css } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function TableBody({ children }: PropsWithChildren) {
  const style = css``;

  return <tbody class={style}>{children}</tbody>;
}
