import { envSchema } from '@repo/schemas';
import { config } from 'dotenv';
import { z } from 'zod';

config();

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.error('\u274c Invalid environment variables:');
      error.issues.forEach((err) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
};

export const env = parseEnv();
