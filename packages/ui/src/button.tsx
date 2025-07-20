'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  appName: string;
}

export const Button = ({ children, appName, ...props }: ButtonProps) => (
  <button {...props} onClick={() => alert(`Hello from your ${appName} app!`)}>
    {children}
  </button>
);
