import { eq } from 'drizzle-orm';
import db from '../index.js';
import userTable from '../schema/user.js';

export default {
  async getById(id: number) {
    const result = await db
      .select()
      .from(userTable)
      .where(eq(userTable.id, id));
    return result[0];
  },
  async getByUsername(username: string) {
    const result = await db
      .select()
      .from(userTable)
      .where(eq(userTable.username, username));
    return result[0];
  },
  async create(username: string, passwordHash: string) {
    const result = await db
      .insert(userTable)
      .values({ username, passwordHash });
    return result;
  },
  async update(
    id: number,
    data: Partial<{ username: string; passwordHash: string }>,
  ) {
    const result = await db
      .update(userTable)
      .set(data)
      .where(eq(userTable.id, id));
    return result;
  },
  async delete(id: number) {
    const result = await db.delete(userTable).where(eq(userTable.id, id));
    return result;
  },
};
