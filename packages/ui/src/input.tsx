import type { InputHTMLAttributes } from 'react';
import { cn } from './utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelClassName?: string | undefined;
}

export const Input = ({
  label,
  labelClassName,
  className = '',
  ...props
}: InputProps) => (
  <>
    <label
      htmlFor={props.id}
      className={cn('mb-1 block font-medium', labelClassName)}
    >
      {label}:
    </label>
    <input
      {...props}
      className={cn(
        'w-full rounded border border-gray-300 p-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-500',
        className,
      )}
    />
  </>
);
