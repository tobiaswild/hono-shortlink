import { css } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

export default function Container({
  children,
  variant = 'normal',
}: PropsWithChildren<{ variant?: 'normal' | 'centered' }>) {
  if (variant === 'centered') {
    const centered = css`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f5f5f5;
  `;

    const box = css`
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

    return (
      <div class={centered}>
        <div class={box}>{children}</div>
      </div>
    );
  }

  const container = css`
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  `;

  return <div class={container}>{children}</div>;
}
