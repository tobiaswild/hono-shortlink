# hono-shortlink

A simple URL shortener service built with [Hono](https://hono.dev/) and Node.js, using TypeScript and persistent JSON storage.

## Features
- Create shortlinks for any URL
- Redirect shortlinks to their original URLs
- Persistent storage in `data.json`
- Ready for deployment with GitHub Actions and pm2

## Setup

```bash
pnpm install
```

## Development

```bash
pnpm run dev
```

The server will start at [http://localhost:3000](http://localhost:3000)

## Build

```bash
pnpm run build
```

## API

### POST /shorten
Create a new shortlink.

**Request:**
```json
{
  "url": "https://example.com"
}
```

**Response:**
```json
{
  "short": "http://localhost:3000/abc123"
}
```

### GET /:code
Redirects to the original URL for the given shortlink code.

## Persistent Storage
- All shortlinks are stored in `data.json` in the project root.
- This file is committed to git for transparency.

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

---

Feel free to fork, modify, and use for your own projects!

```
open http://localhost:3000
```
