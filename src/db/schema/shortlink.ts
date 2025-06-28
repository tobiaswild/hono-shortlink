import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const shortlinkTable = sqliteTable('shortlink', {
  id: int().primaryKey({ autoIncrement: true }),
  code: text().notNull().unique(),
  url: text().notNull(),
});
