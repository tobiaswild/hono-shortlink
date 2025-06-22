FROM node:22-alpine AS base

# Use corepack to enable pnpm, which is included with Node.js
RUN corepack enable

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

# Copy dependency-related files first for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files
COPY tsconfig.json ./
COPY src ./src

# Build the project
RUN pnpm run build

# Prune dev dependencies to reduce image size
RUN pnpm prune --prod

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy only the necessary production files from the builder stage
COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "dist/index.js"]