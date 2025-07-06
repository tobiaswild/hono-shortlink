import { css, cx } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';
import { btnClass, primaryClass } from './button.js';

export default function Link({
  children,
  href,
  target,
  variant = 'normal',
}: PropsWithChildren<{
  href?: string | undefined;
  target?: string | undefined;
  variant?: 'normal' | 'button';
}>) {
  const variantClasses = {
    normal: '',
    button: cx(
      btnClass,
      primaryClass,
      css`
        text-decoration: none;`,
    ),
  };

  return (
    <a href={href} target={target} class={variantClasses[variant]}>
      {children}
    </a>
  );
}
