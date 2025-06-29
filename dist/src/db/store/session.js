import db from '@/db/index.js';
import sessionTable from '@/db/schema/session.js';
import { and, eq, gte } from 'drizzle-orm';
export default {
    async get(code) {
        const result = await db.select().from(sessionTable).where(eq(sessionTable.code, code));
        return result[0];
    },
    async set(code, userId, expires) {
        await db.insert(sessionTable).values({ code, userId, expires }).onConflictDoUpdate({
            target: sessionTable.code,
            set: { userId, expires },
        });
    },
    async has(code) {
        const result = await db
            .select({ code: sessionTable.code })
            .from(sessionTable)
            .where(and(eq(sessionTable.code, code), gte(sessionTable.expires, Date.now())));
        return result.length > 0;
    },
    async delete(code) {
        const result = await db.delete(sessionTable).where(eq(sessionTable.code, code));
        return result.rowsAffected > 0;
    },
    async deleteByUserId(userId) {
        const result = await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
        return result.rowsAffected > 0;
    },
};
