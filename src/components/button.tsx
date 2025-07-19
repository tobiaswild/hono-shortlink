import { css, cx } from 'hono/css';
import type { PropsWithChildren } from 'hono/jsx';

type ButtonSize = 'small' | 'default' | 'large';
type ButtonVariant = 'primary' | 'danger' | 'success' | 'secondary';

interface ButtonProps extends PropsWithChildren {
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  class?: string;
}

export const btnClass = css`
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;

  background: transparent;

  color: inherit;
  font: inherit;

  line-height: normal;

  -webkit-font-smoothing: inherit;
  -moz-osx-font-smoothing: inherit;

  -webkit-appearance: none;

  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

export const primaryClass = css`
  background: #2563eb;
  &:hover {
    background: #1d4ed8;
  }
`;

export default function Button({
  children,
  size = 'default',
  variant = 'primary',
  fullWidth = false,
  type = 'button',
  disabled = false,
  class: className,
}: ButtonProps) {
  const sizeClasses = {
    small: css`
      padding: 6px 12px;
      font-size: 12px;
      border-radius: 3px;
      `,
    default: '',
    large: css`
      padding: 12px 24px;
      font-size: 16px;
      font-weight: 500;
      `,
  };

  const variantClasses = {
    primary: primaryClass,
    danger: css`
      background: #dc2626;
      &:hover {
        background: #b91c1c
      }
    `,
    success: css`
      background: #059669;
      &:hover {
        background: #047857;
      }
    `,
    secondary: ``,
  };

  const classes = cx(
    btnClass,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth &&
      css`
    width: 100%;
  `,
    className,
  );

  return (
    <button type={type} disabled={disabled} class={classes}>
      {children}
    </button>
  );
}
