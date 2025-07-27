import { drizzle } from 'drizzle-orm/libsql';
import { env } from '../config/env';

export const db = drizzle(`file:${env.DB_FILE_NAME}`);
