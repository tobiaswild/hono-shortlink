import type shortlinkTable from '@/db/schema/shortlink.js';

export type Shortlink = typeof shortlinkTable.$inferSelect;
