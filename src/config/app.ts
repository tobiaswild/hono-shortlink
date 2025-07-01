export const APP_CONFIG = {
  SESSION_COOKIE: 'session',
  SESSION_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours in milliseconds

  SHORTLINK_CODE_LENGTH: 6,

  BCRYPT_SALT_ROUNDS: 12,

  APP_NAME: 'Hono Shortlink',
} as const;
