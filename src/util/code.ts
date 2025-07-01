import { APP_CONFIG } from '@/config/app.js';
import shortlinkStore from '@/db/store/shortlink.js';

export async function getCode() {
  let code: string;
  let attempts = 0;
  const maxAttempts = 10;

  do {
    code = await generateCode();
    attempts++;
  } while ((await shortlinkStore.has(code)) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    throw new Error('max attempts reached');
  }

  return code;
}

function generateCode() {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < APP_CONFIG.SHORTLINK_CODE_LENGTH; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
