import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const sessionTable = sqliteTable('session', {
  id: int().primaryKey({ autoIncrement: true }),
  userId: int().notNull(),
  code: text().notNull().unique(),
  expires: int().notNull(),
});

export default sessionTable;
