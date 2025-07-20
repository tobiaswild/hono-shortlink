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
      className={cn('ui:mb-1 ui:block ui:font-medium', labelClassName)}
    >
      {label}:
    </label>
    <input
      {...props}
      className={cn(
        'ui:w-full ui:rounded ui:border ui:border-gray-300 ui:p-2.5 ui:text-base ui:focus:outline-none ui:focus:ring-2 ui:focus:ring-blue-500',
        className,
      )}
    />
  </>
);
