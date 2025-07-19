import { css } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function TableRow({ children }: PropsWithChildren) {
  const style = css`
 &:hover {
 background: #f9fafb;
 }`;

  return <tr class={style}>{children}</tr>;
}
