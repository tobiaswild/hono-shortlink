import type { PropsWithChildren } from 'react';

export function AuthContainer({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg bg-white p-10 shadow-lg">
        {children}
      </div>
    </div>
  );
}
