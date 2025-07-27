import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { user } from './auth';

export const shortlink = sqliteTable('shortlink', {
  id: integer().primaryKey({ autoIncrement: true }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  code: text('code').notNull().unique(),
  url: text('url').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type Shortlink = typeof shortlink.$inferSelect;
