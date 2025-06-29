import db from '@/db/index.js';
import shortlinkTable from '@/db/schema/shortlink.js';
import { and, eq } from 'drizzle-orm';

export default {
  async get(code: string) {
    const result = await db.select().from(shortlinkTable).where(eq(shortlinkTable.code, code));
    return result[0]?.url;
  },
  async set(code: string, url: string, userId: number) {
    await db.insert(shortlinkTable).values({ code, url, userId }).onConflictDoUpdate({
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
  async getAll() {
    return await db.select().from(shortlinkTable).orderBy(shortlinkTable.id);
  },
  async getAllByUserId(userId: number) {
    return await db
      .select()
      .from(shortlinkTable)
      .where(eq(shortlinkTable.userId, userId))
      .orderBy(shortlinkTable.id);
  },
  async delete(code: string) {
    const result = await db.delete(shortlinkTable).where(eq(shortlinkTable.code, code));
    return result.rowsAffected > 0;
  },
  async deleteByUserId(code: string, userId: number) {
    const result = await db
      .delete(shortlinkTable)
      .where(and(eq(shortlinkTable.code, code), eq(shortlinkTable.userId, userId)));
    return result.rowsAffected > 0;
  },
};
