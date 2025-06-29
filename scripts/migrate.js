import { createClient } from '@libsql/client';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config();

const db = createClient({
  url: `file:${process.env.DB_FILE_NAME}`,
});

async function migrate() {
  console.log('Starting database migration for multi-user support...');

  try {
    // Create user table
    console.log('Creating user table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL
      )
    `);

    // Create new session table with userId
    console.log('Creating new session table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS session_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        code TEXT NOT NULL UNIQUE,
        expires INTEGER NOT NULL
      )
    `);

    // Create new shortlink table with userId
    console.log('Creating new shortlink table...');
    await db.execute(`
      CREATE TABLE IF NOT EXISTS shortlink_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        code TEXT NOT NULL UNIQUE,
        url TEXT NOT NULL
      )
    `);

    // Check if old tables exist and migrate data
    const oldSessionExists = await db.execute(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='session'
    `);
    
    const oldShortlinkExists = await db.execute(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='shortlink'
    `);

    if (oldSessionExists.rows.length > 0) {
      console.log('Migrating session data...');
      // For now, we'll drop old sessions since they're not user-specific
      await db.execute('DROP TABLE session');
    }

    // Always create default admin user
    console.log('Creating default admin user...');
    const passwordHash = await bcrypt.hash('admin123', 12);
    
    // Check if admin user already exists
    const existingAdmin = await db.execute('SELECT id FROM user WHERE username = ?', ['admin']);
    if (existingAdmin.rows.length === 0) {
      await db.execute(`
        INSERT INTO user (username, email, passwordHash) 
        VALUES (?, ?, ?)
      `, ['admin', 'admin@example.com', passwordHash]);
      console.log('Default admin user created.');
    } else {
      console.log('Admin user already exists.');
    }

    if (oldShortlinkExists.rows.length > 0) {
      console.log('Migrating shortlink data...');
      
      // Get admin user ID
      const adminUser = await db.execute('SELECT id FROM user WHERE username = ?', ['admin']);
      const userId = adminUser.rows[0].id;
      
      // Migrate existing shortlinks to the default user
      await db.execute(`
        INSERT INTO shortlink_new (userId, code, url)
        SELECT ?, code, url FROM shortlink
      `, [userId]);
      
      // Drop old table
      await db.execute('DROP TABLE shortlink');
    }

    // Rename new tables to final names
    console.log('Renaming tables...');
    await db.execute('ALTER TABLE session_new RENAME TO session');
    await db.execute('ALTER TABLE shortlink_new RENAME TO shortlink');

    console.log('Migration completed successfully!');
    console.log('Default admin user created with:');
    console.log('Username: admin');
    console.log('Email: admin@example.com');
    console.log('Password: admin123');
    console.log('Please change these credentials after first login.');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate(); 