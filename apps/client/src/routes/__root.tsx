import type { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return (
    <ThemeProvider attribute="class">
      <Outlet />
      <Toaster />
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </ThemeProvider>
  );
}
