import { css } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function TableHead({ children }: PropsWithChildren) {
  const style = css``;

  return <thead class={style}>{children}</thead>;
}
