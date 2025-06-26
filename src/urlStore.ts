import db from './db.js';

export default {
  async get(code: string) {
    const row = db.prepare('SELECT url FROM shortlinks WHERE code = ?').get(code);
    return row ? row.url : undefined;
  },
  async set(code: string, url: string) {
    db.prepare('INSERT OR REPLACE INTO shortlinks (code, url) VALUES (?, ?)').run(code, url);
  },
  async has(code: string) {
    const row = db.prepare('SELECT 1 FROM shortlinks WHERE code = ?').get(code);
    return !!row;
  }
} 