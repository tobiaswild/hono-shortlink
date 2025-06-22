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

## Running with Docker

You can also run the application inside a Docker container.

### 1. Build the Image

First, build the Docker image:
```bash
docker build -t hono-shortlink .
```

### 2. Run the Container

Then, run the container, mapping port 3000 to your local machine:
```bash
docker run -p 3000:3000 --name my-shortlink-app hono-shortlink
```
The application will be available at `http://localhost:3000`.

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

## Docker Deployment
This repository is also configured with a GitHub Actions workflow to automatically build and publish a Docker image to the GitHub Container Registry (GHCR) on every push to `main`. You can pull and run this image directly for deployment.

---

Feel free to fork, modify, and use for your own projects!

```
open http://localhost:3000
```
