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

## Database Setup

After setting up your environment variables, set up the database using Drizzle:

For development (recommended):

```bash
pnpm db:push
```

For production with migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

Optional: View database in Drizzle Studio:

```bash
pnpm db:studio
```

## Running the Application

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Set up the database:

   ```bash
   pnpm db:push
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

## Database Management

- **Push schema (dev)**: `pnpm db:push` - Pushes schema changes directly to database (development)
- **Generate migrations**: `pnpm db:generate` - Creates migration files based on schema changes
- **Run migrations**: `pnpm db:migrate` - Applies pending migrations to the database (production)
- **View database**: `pnpm db:studio` - Opens Drizzle Studio to view and edit data
