# Environment Setup

## Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database file name (SQLite)
DB_FILE_NAME=shortlink.db

# Secret key for session security (generate a random string)
SECRET_KEY=your-secret-key-here

# Port for the server (optional, defaults to 3000)
PORT=3000

# Session cookie name (optional, defaults to 'session')
SESSION_COOKIE=session
```

## Database Migration

After setting up your environment variables, run the database migration to set up the multi-user schema:

```bash
pnpm migrate
```

This will:

- Create the user table for multi-user support
- Update the session and shortlink tables to include user relationships
- Create a default admin user with credentials:
  - Username: `admin`
  - Email: `admin@example.com`
  - Password: `admin123`

**Important**: Change the default admin credentials after first login for security.

## Running the Application

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the migration:

   ```bash
   pnpm migrate
   ```

3. Start the development server:

   ```bash
   pnpm dev
   ```

4. Visit `http://localhost:3000` to access the application

## Multi-User Features

The application now supports:

- User registration and login
- User-specific shortlink management
- Secure password hashing with bcrypt
- Session-based authentication
- Data isolation between users

Each user can only see and manage their own shortlinks, providing proper data isolation and security.
