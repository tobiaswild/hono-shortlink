import { css } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function InputLabel({
  children,
  for: forId,
}: PropsWithChildren<{
  for?: string | undefined;
}>) {
  const formGroupLabel = css`
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  `;

  return (
    <label for={forId} class={formGroupLabel}>
      {children}
    </label>
  );
}
