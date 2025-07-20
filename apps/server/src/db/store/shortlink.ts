import { and, eq } from 'drizzle-orm';
import db from '../index.js';
import shortlinkTable from '../schema/shortlink.js';
import type { User } from '../schema/user.js';

export default {
  async getAllForUser(user: User) {
    return await db
      .select()
      .from(shortlinkTable)
      .where(eq(shortlinkTable.userId, user.id))
      .orderBy(shortlinkTable.id);
  },
  async createForUser(user: User, code: string, url: string) {
    await db
      .insert(shortlinkTable)
      .values({
        userId: user.id,
        code: code,
        url: url,
      })
      .onConflictDoNothing();
  },
  async getForUser(user: User, code: string) {
    const result = await db
      .select()
      .from(shortlinkTable)
      .where(
        and(eq(shortlinkTable.userId, user.id), eq(shortlinkTable.code, code)),
      );
    return result[0];
  },
  async updateForUser(user: User, code: string, url: string) {
    await db
      .update(shortlinkTable)
      .set({ url: url })
      .where(
        and(eq(shortlinkTable.userId, user.id), eq(shortlinkTable.code, code)),
      );
  },
  async deleteForUser(user: User, code: string) {
    const result = await db
      .delete(shortlinkTable)
      .where(
        and(eq(shortlinkTable.userId, user.id), eq(shortlinkTable.code, code)),
      );
    return result.rowsAffected > 0;
  },
  async has(code: string) {
    const result = await db
      .select({ code: shortlinkTable.code })
      .from(shortlinkTable)
      .where(eq(shortlinkTable.code, code));
    return result.length > 0;
  },
};
