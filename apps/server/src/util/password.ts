import bcrypt from 'bcrypt';
import { APP_CONFIG } from '../config/app.js';

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, APP_CONFIG.BCRYPT_SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}
