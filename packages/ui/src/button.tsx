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
  small: 'ui:px-3 ui:py-1.5 ui:text-xs ui:rounded',
  default: 'ui:px-4 ui:py-2 ui:text-sm ui:rounded-md',
  large: 'ui:px-6 ui:py-3 ui:text-base ui:rounded-lg',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'ui:bg-blue-600 ui:text-white ui:hover:bg-blue-700',
  danger: 'ui:bg-red-600 ui:text-white ui:hover:bg-red-700',
  success: 'ui:bg-green-600 ui:text-white ui:hover:bg-green-700',
  secondary: 'ui:bg-gray-200 ui:text-gray-900 ui:hover:bg-gray-300',
};

const baseClass =
  'ui:font-medium ui:transition ui:focus:outline-none ui:disabled:opacity-50 ui:disabled:cursor-not-allowed';

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
        fullWidth ? 'ui:w-full' : '',
        className,
      )}
    >
      {children}
    </button>
  );
};
