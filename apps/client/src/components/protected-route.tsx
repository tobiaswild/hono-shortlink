import { useNavigate } from '@tanstack/react-router';
import { type ReactNode, useEffect } from 'react';
import { authClient } from '../utils/auth';
import { AuthContainer } from './auth-container';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectTo?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  redirectTo = '/login',
  fallback = <AuthContainer>Loading...</AuthContainer>,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const session = authClient.useSession();

  useEffect(() => {
    if (!session.isPending && session.data === null) {
      navigate({ to: redirectTo });
    }
  }, [session.isPending, session.data, navigate, redirectTo]);

  if (session.isPending) {
    return <>{fallback}</>;
  }

  if (session.data === null) {
    return null;
  }

  return <>{children}</>;
}
