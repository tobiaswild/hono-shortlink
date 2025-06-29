import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';
const shortlinkTable = sqliteTable('shortlink', {
    id: int().primaryKey({ autoIncrement: true }),
    userId: int().notNull(),
    code: text().notNull().unique(),
    url: text().notNull(),
});
export default shortlinkTable;
