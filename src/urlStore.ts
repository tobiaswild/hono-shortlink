import { eq } from 'drizzle-orm';
import { db } from './db/db.js';
import { shortlinkTable } from './db/schema.js';

export default {
  async get(code: string) {
    const result = await db.select().from(shortlinkTable).where(eq(shortlinkTable.code, code));
    return result[0]?.url;
  },
  async set(code: string, url: string) {
    await db.insert(shortlinkTable).values({ code, url }).onConflictDoUpdate({
      target: shortlinkTable.code,
      set: { url },
    });
  },
  async has(code: string) {
    const result = await db
      .select({ code: shortlinkTable.code })
      .from(shortlinkTable)
      .where(eq(shortlinkTable.code, code));
    return result.length > 0;
  },
};
