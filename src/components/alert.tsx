import { css, cx } from 'hono/css';
import type { Flash } from '@/util/flash.js';

export default function Alert({ flash }: { flash?: Flash }) {
  const alertClass = css`
   padding: 12px;
   border-radius: 4px;
   margin-bottom: 15px;
 `;

  const variantClasses = {
    success: css`
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
  `,
    neutral: '',
    error: css`
      background: #fee2e2;
      color: #991b1b;
      border: 1px solid #fecaca;
  `,
  };

  if (!flash) {
    return null;
  }

  return (
    <div class={cx(alertClass, variantClasses[flash?.type])}>
      {flash.message}
    </div>
  );
}
