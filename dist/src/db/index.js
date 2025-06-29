import { env } from '@/config/env.js';
import { drizzle } from 'drizzle-orm/libsql';
const db = drizzle(`file:${env.DB_FILE_NAME}`);
export default db;
