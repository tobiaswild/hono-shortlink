import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const userTable = sqliteTable('user', {
  id: int().primaryKey({ autoIncrement: true }),
  username: text().notNull().unique(),
  passwordHash: text().notNull(),
});

export type User = typeof userTable.$inferSelect;
export default userTable;
