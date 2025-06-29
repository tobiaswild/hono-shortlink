import { APP_CONFIG } from '@/config/app.js';
import urlStore from '@/db/store/shortlink.js';

export async function getCode() {
  let code;
  do {
    code = generateCode();
  } while (await urlStore.has(code));

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
