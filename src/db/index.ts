import { drizzle } from 'drizzle-orm/libsql';
import { env } from '@/config/env.js';

const db = drizzle(`file:${env.DB_FILE_NAME}`);

export default db;
