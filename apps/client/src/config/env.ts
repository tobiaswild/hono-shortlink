export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  REDIRECT_BASE_URL:
    import.meta.env.VITE_REDIRECT_BASE_URL || 'http://localhost:3000/redirect',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Hono Shortlink',
  DEV_TOOLS: import.meta.env.VITE_DEV_TOOLS === 'true' || import.meta.env.DEV,
} as const;
