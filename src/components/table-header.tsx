import { css } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function TableHeader({ children }: PropsWithChildren) {
  const style = css`
 padding: 12px;
 text-align: left;
 border-bottom: 1px solid #e5e7eb;
 background: #f9fafb;
 font-weight: 600;
`;

  return <th class={style}>{children}</th>;
}
