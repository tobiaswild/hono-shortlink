import type { PropsWithChildren } from 'react';

export function AuthContainer({ children }: PropsWithChildren) {
  return (
    <div className="flex w-full max-w-xl flex-col gap-4 rounded-lg bg-white p-10 shadow-lg dark:bg-gray-800">
      {children}
    </div>
  );
}
