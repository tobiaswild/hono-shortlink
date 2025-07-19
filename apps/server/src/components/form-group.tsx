import { css } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function FormGroup({ children }: PropsWithChildren) {
  const formGroup = css``;

  return <div class={formGroup}>{children}</div>;
}
