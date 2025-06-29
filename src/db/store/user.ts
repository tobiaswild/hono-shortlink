import db from '@/db/index.js';
import userTable from '@/db/schema/user.js';
import { eq } from 'drizzle-orm';

export default {
  async getById(id: number) {
    const result = await db.select().from(userTable).where(eq(userTable.id, id));
    return result[0];
  },
  async getByUsername(username: string) {
    const result = await db.select().from(userTable).where(eq(userTable.username, username));
    return result[0];
  },
  async getByEmail(email: string) {
    const result = await db.select().from(userTable).where(eq(userTable.email, email));
    return result[0];
  },
  async create(username: string, email: string, passwordHash: string) {
    const result = await db.insert(userTable).values({ username, email, passwordHash });
    return result;
  },
  async update(
    id: number,
    data: Partial<{ username: string; email: string; passwordHash: string }>
  ) {
    const result = await db.update(userTable).set(data).where(eq(userTable.id, id));
    return result;
  },
  async delete(id: number) {
    const result = await db.delete(userTable).where(eq(userTable.id, id));
    return result;
  },
};
