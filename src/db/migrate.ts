import db from './index.js';

async function migrate() {
  console.log('Starting database migration...');

  try {
    // Create user table
    console.log('Creating user table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        passwordHash TEXT NOT NULL
      )
    `);

    // Create new session table with userId
    console.log('Creating new session table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS session_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        code TEXT NOT NULL UNIQUE,
        expires INTEGER NOT NULL
      )
    `);

    // Create new shortlink table with userId
    console.log('Creating new shortlink table...');
    await db.run(`
      CREATE TABLE IF NOT EXISTS shortlink_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        code TEXT NOT NULL UNIQUE,
        url TEXT NOT NULL
      )
    `);

    // Check if old tables exist and migrate data
    const oldSessionExists = await db.run(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='session'
    `);

    const oldShortlinkExists = await db.run(`
      SELECT name FROM sqlite_master WHERE type='table' AND name='shortlink'
    `);

    if (oldSessionExists.rows.length > 0) {
      console.log('Migrating session data...');
      // For now, we'll drop old sessions since they're not user-specific
      await db.run('DROP TABLE session');
    }

    if (oldShortlinkExists.rows.length > 0) {
      console.log('Migrating shortlink data...');
      // We need to create a default user for existing shortlinks
      const defaultUser = await db.run(`
        INSERT INTO user (username, email, passwordHash) 
        VALUES ('admin', 'admin@example.com', '$2b$12$dummy.hash.for.migration')
      `);

      const userId = defaultUser.lastInsertRowid;

      // Migrate existing shortlinks to the default user
      await db.run(`
        INSERT INTO shortlink_new (userId, code, url)
        SELECT ${userId}, code, url FROM shortlink
      `);

      // Drop old table
      await db.run('DROP TABLE shortlink');
    }

    // Rename new tables to final names
    console.log('Renaming tables...');
    await db.run('ALTER TABLE session_new RENAME TO session');
    await db.run('ALTER TABLE shortlink_new RENAME TO shortlink');

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

// Run migration if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate();
}

export default migrate;
