import { createClient } from '@libsql/client';
import { config } from 'dotenv';

config();

const db = createClient({
  url: `file:${process.env.DB_FILE_NAME}`,
});

async function checkDb() {
  try {
    console.log('Checking database contents...');

    // Check users table
    const users = await db.execute('SELECT id, username, email FROM user');
    console.log('Users:', users.rows);

    // Check sessions table
    const sessions = await db.execute('SELECT id, userId, code, expires FROM session');
    console.log('Sessions:', sessions.rows);

    // Check shortlinks table
    const shortlinks = await db.execute('SELECT id, userId, code, url FROM shortlink');
    console.log('Shortlinks:', shortlinks.rows);
  } catch (error) {
    console.error('Error checking database:', error);
  }
}

checkDb();
