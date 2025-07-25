import { and, eq } from 'drizzle-orm';
import db from '../index.js';
import shortlinkTable from '../schema/shortlink.js';

export default {
  async get(code: string) {
    const result = await db
      .select()
      .from(shortlinkTable)
      .where(eq(shortlinkTable.code, code));
    return result[0]?.url;
  },
  async set(code: string, url: string, userId: number) {
    await db
      .insert(shortlinkTable)
      .values({ code, url, userId })
      .onConflictDoUpdate({
        target: shortlinkTable.code,
        set: { url, userId },
      });
  },
  async has(code: string) {
    const result = await db
      .select({ code: shortlinkTable.code })
      .from(shortlinkTable)
      .where(eq(shortlinkTable.code, code));
    return result.length > 0;
  },
  async getAllByUserId(userId: number) {
    return await db
      .select()
      .from(shortlinkTable)
      .where(eq(shortlinkTable.userId, userId))
      .orderBy(shortlinkTable.id);
  },
  async deleteByUserId(code: string, userId: number) {
    const result = await db
      .delete(shortlinkTable)
      .where(
        and(eq(shortlinkTable.code, code), eq(shortlinkTable.userId, userId)),
      );
    return result.rowsAffected > 0;
  },
};
