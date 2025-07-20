import { z } from 'zod';

export const envSchema = z.object({
  DB_FILE_NAME: z.string().min(1, 'Database file name is required'),
  PORT: z
    .string()
    .optional()
    .default('3000')
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(65535)),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});
