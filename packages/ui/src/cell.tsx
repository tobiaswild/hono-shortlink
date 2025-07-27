import type { FormHTMLAttributes } from 'react';
import { cn } from './utils';

interface CellProps extends FormHTMLAttributes<HTMLDivElement> {}

export const Cell = ({ children, className = '', ...props }: CellProps) => {
  return (
    <p
      className={cn(
        'block font-normal font-sans text-blue-gray-900 leading-normal antialiased',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
};
