import { env } from '@/config/env.js';
import { drizzle } from 'drizzle-orm/libsql';

export const db = drizzle(env.DB_FILE_NAME);
