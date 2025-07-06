import { css } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function FormGroup({ children }: PropsWithChildren) {
  const formGroup = css`
    margin-bottom: 15px;
  `;

  return <div class={formGroup}>{children}</div>;
}
