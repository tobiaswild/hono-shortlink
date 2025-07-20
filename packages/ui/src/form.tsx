import type { FormHTMLAttributes } from 'react';
import { cn } from './utils';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {}

export const Form = ({ children, className = '', ...props }: FormProps) => {
  return (
    <form className={cn('ui:flex ui:flex-col ui:gap-4', className)} {...props}>
      {children}
    </form>
  );
};
