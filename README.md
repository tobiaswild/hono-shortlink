# hono-shortlink

A multi-user URL shortener service built with [Hono](https://hono.dev/) and Node.js, using TypeScript and SQLite for persistent storage.

## Features

- **Multi-user support** with secure authentication
- User registration and login system
- Create shortlinks for any URL
- Redirect shortlinks to their original URLs
- User-specific shortlink management
- Persistent storage in SQLite database
- Secure password hashing with bcrypt
- Session-based authentication
- Ready for deployment with GitHub Actions and pm2

## Setup

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:

   ```env
   DB_FILE_NAME=shortlink.db
   PORT=3000
   SESSION_COOKIE=session
   ```

3. **Set up the database:**

   ```bash
   pnpm db:push
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

The server will start at [http://localhost:3000](http://localhost:3000)

## Multi-User Features

### User Registration

- Visit `/admin/register` to create a new account
- Each user gets their own isolated shortlink space
- Username and email must be unique

### User Login

- Visit `/admin/login` to sign in
- Secure session-based authentication
- Users can only see and manage their own shortlinks

### Dashboard

- View all your shortlinks
- Create new shortlinks with custom codes
- Delete your shortlinks
- Copy shortlink URLs

## Docker Usage

This project is fully containerized and can be run locally or deployed using Docker.

### Running Locally

1.  **Build the image:**

    ```bash
    docker build -t hono-shortlink .
    ```

2.  **Run the container:**
    ```bash
    docker run --rm -it -p 3000:3000 --name my-shortlink-app hono-shortlink
    ```
    - `--rm`: Automatically removes the container when it exits.
    - `-it`: Runs in interactive mode, allowing you to stop it with `Ctrl+C`.
    - The server will be available at `http://localhost:3000`.

### Running the Pre-built Image from GHCR

A new image is automatically built and pushed to the GitHub Container Registry (GHCR) on every push to `main`. You can run the latest version directly:

```bash
docker run --rm -it -p 3000:3000 --name my-shortlink-app ghcr.io/tobiaswild/hono-shortlink:latest
```

> **Note:** If the package is private, you may need to log in to GHCR first with `docker login ghcr.io`.

### Graceful Shutdown

The container is configured to handle `SIGINT` and `SIGTERM` signals, allowing for a graceful shutdown when you press `Ctrl+C` or run `docker stop`.

## Build

```bash
pnpm run build
```

## API

### GET /:code

Redirects to the original URL for the given shortlink code.

### Admin Routes

- **GET /admin/login** - Login page
- **POST /admin/login** - User authentication
- **GET /admin/register** - Registration page
- **POST /admin/register** - User registration
- **GET /admin/dashboard** - User dashboard (requires auth)
- **POST /admin/create** - Create new shortlink (requires auth)
- **POST /admin/delete/:code** - Delete shortlink (requires auth)
- **POST /admin/logout** - Logout (requires auth)

## Database

- All data is stored in SQLite database
- Users, sessions, and shortlinks are properly related
- Data isolation ensures users can only access their own shortlinks
- Uses Drizzle ORM for type-safe database operations

## Database Management

- **Push schema (dev)**: `pnpm db:push` - Pushes schema changes directly to database (development)
- **Generate migrations**: `pnpm db:generate` - Creates migration files based on schema changes
- **Run migrations**: `pnpm db:migrate` - Applies pending migrations to the database (production)
- **View database**: `pnpm db:studio` - Opens Drizzle Studio to view and edit data

## Security Features

- Password hashing with bcrypt (12 rounds)
- Session-based authentication
- User data isolation
- Secure cookie handling
- Input validation with Zod

## Deployment

This project includes a GitHub Actions workflow for automated deployment to a Linux VM using SSH and pm2.

### Requirements on your server

- Node.js, pnpm, and pm2 installed
- SSH access set up (private key added as a GitHub secret)
- The repository cloned to your server

### GitHub Secrets needed

- `DEPLOY_SSH_PRIVATE_KEY`: SSH private key for deployment
- `DEPLOY_REMOTE_HOST`: Server IP or hostname
- `DEPLOY_REMOTE_USER`: SSH username
- `DEPLOY_REMOTE_TARGET`: Path to deploy directory on server

### How it works

- On every push to `main`, the workflow builds the app and deploys the `dist/` folder to your server.
- After deployment, pm2 reloads or starts the service automatically.

## Docker Deployment

This repository is also configured with a GitHub Actions workflow to automatically build and publish a Docker image to the GitHub Container Registry (GHCR) on every push to `main`. You can pull and run this image directly for deployment.

---

Feel free to fork, modify, and use for your own projects!

```
open http://localhost:3000
```
