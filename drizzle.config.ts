import { env } from '@/config/env.js';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DB_FILE_NAME,
  },
});
