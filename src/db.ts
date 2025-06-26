import Database from 'better-sqlite3';
import path from 'path';

const DB_FILE = path.join(process.cwd(), 'shortlinks.db');
const db = new Database(DB_FILE);

db.exec(`
  CREATE TABLE IF NOT EXISTS shortlinks (
    code TEXT PRIMARY KEY,
    url TEXT NOT NULL
  )
`);

export default db; 