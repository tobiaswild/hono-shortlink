import type { PropsWithChildren } from 'react';

export function AuthContainer({ children }: PropsWithChildren) {
  return (
    <div className="ui:flex ui:min-h-screen ui:items-center ui:justify-center ui:bg-gray-100">
      <div className="ui:flex ui:w-full ui:max-w-xl ui:flex-col ui:gap-4 ui:rounded-lg ui:bg-white ui:p-10 ui:shadow-lg">
        {children}
      </div>
    </div>
  );
}
