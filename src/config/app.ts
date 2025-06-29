// Application configuration constants
export const APP_CONFIG = {
  // Session configuration
  SESSION_COOKIE: 'session',
  SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

  // Shortlink configuration
  SHORTLINK_CODE_LENGTH: 6,

  // Security configuration
  BCRYPT_SALT_ROUNDS: 12,

  // UI configuration
  APP_NAME: 'Hono Shortlink',
} as const;
