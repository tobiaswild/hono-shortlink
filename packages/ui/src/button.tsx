'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  appName: string;
}

export const Button = ({ children, appName, ...props }: ButtonProps) => (
  <button
    {...props}
    className="ui:bg-blue-600 ui:text-white ui:hover:bg-blue-700"
  >
    {children}
  </button>
);
