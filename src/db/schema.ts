import { int, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const shortlinkTable = sqliteTable('shortlink', {
  id: int().primaryKey({ autoIncrement: true }),
  code: text().notNull().unique(),
  url: text().notNull(),
});

export type Shortlink = typeof shortlinkTable.$inferSelect;

export const sessionTable = sqliteTable('session', {
  id: int().primaryKey({ autoIncrement: true }),
  code: text().notNull().unique(),
  expires: integer().notNull(),
});

export type Session = typeof sessionTable.$inferSelect;
