import { css, cx } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function TableData({
  children,
  class: className,
  title,
}: PropsWithChildren<{
  class?: Promise<string>;
  title?: string | undefined;
}>) {
  const style = css`
 padding: 12px;
 text-align: left;
 border-bottom: 1px solid #e5e7eb;
`;

  return (
    <td class={cx(style, className)} title={title}>
      {children}
    </td>
  );
}
