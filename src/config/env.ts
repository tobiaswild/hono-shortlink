import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  DB_FILE_NAME: z.string().min(1, 'Database file name is required'),
  SECRET_KEY: z.string().min(1, 'Secret key is required'),
  PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().min(1).max(65535))
    .default('3000'),
  SESSION_COOKIE: z.string().min(1, 'Session cookie name is required').default('session'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:');
      error.errors.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();

export type Env = z.infer<typeof envSchema>;
