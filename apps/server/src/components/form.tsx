import { css, cx } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function Form({
  children,
  method,
  action,
  class: className,
}: PropsWithChildren<{
  method?: 'post' | 'get' | undefined;
  action?: string;
  class?: Promise<string>;
}>) {
  const style = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: fit-content;
  `;

  return (
    <form method={method} action={action} class={cx(style, className)}>
      {children}
    </form>
  );
}
