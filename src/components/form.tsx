import type { PropsWithChildren } from 'hono/jsx';

export default function Form({
  children,
  method,
  action,
}: PropsWithChildren<{
  method?: 'post' | 'get' | undefined;
  action?: string;
}>) {
  return (
    <form method={method} action={action}>
      {children}
    </form>
  );
}
