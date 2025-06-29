import type { User } from '@/db/schema/user.js';

declare module 'hono' {
  interface ContextVariableMap {
    user: User;
  }
}
