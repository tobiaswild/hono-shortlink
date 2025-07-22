import type { ButtonHTMLAttributes } from 'react';
import { cn } from './utils';

export type ButtonSize = 'small' | 'default' | 'large';
export type ButtonVariant = 'primary' | 'danger' | 'success' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: ButtonSize;
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  small: 'px-3 py-1.5 text-xs rounded',
  default: 'px-4 py-2 text-sm rounded-md',
  large: 'px-6 py-3 text-base rounded-lg',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-green-600 text-white hover:bg-green-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
};

const baseClass =
  'font-medium transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';

export const Button = ({
  children,
  size = 'default',
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        baseClass,
        sizeClasses[size],
        variantClasses[variant],
        fullWidth ? 'w-full' : '',
        className,
      )}
    >
      {children}
    </button>
  );
};
