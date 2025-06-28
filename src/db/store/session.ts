import db from '@/db/index.js';
import sessionTable from '@/db/schema/session.js';
import { and, eq, gte } from 'drizzle-orm';

export default {
  async get(code: string) {
    const result = await db.select().from(sessionTable).where(eq(sessionTable.code, code));
    return result[0];
  },
  async set(code: string, expires: number) {
    await db.insert(sessionTable).values({ code, expires }).onConflictDoUpdate({
      target: sessionTable.code,
      set: { expires },
    });
  },
  async has(code: string) {
    const result = await db
      .select({ code: sessionTable.code })
      .from(sessionTable)
      .where(and(eq(sessionTable.code, code), gte(sessionTable.expires, Date.now())));
    return result.length > 0;
  },
  async delete(code: string) {
    const result = await db.delete(sessionTable).where(eq(sessionTable.code, code));
    return result.rowsAffected > 0;
  },
};
