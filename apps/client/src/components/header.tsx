import { Button } from '@repo/ui/button';
import { useNavigate } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import { env } from '../config/env';
import { authClient } from '../utils/auth';

export function Header() {
  const navigate = useNavigate();
  const session = authClient.useSession();

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Logged out successfully');
            navigate({ to: '/login' });
          },
          onError: (ctx) => {
            toast.error(`Logout failed: ${ctx.error.message}`);
          },
        },
      });
    } catch {
      toast.error('Failed to logout');
    }
  };

  if (!session.data) {
    return null;
  }

  return (
    <header className="border-gray-200 border-b bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <h1 className="font-semibold text-gray-900 text-xl">
              {env.APP_NAME}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-gray-700 text-sm">
              Welcome,{' '}
              <span className="font-medium">{session.data.user.email}</span>
            </div>
            <Button variant="secondary" size="small" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
