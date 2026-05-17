# Stage 1: Base image
FROM node:22-alpine AS base
RUN corepack enable
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN apk add --no-cache wget
WORKDIR /app

# Stage 2: Production dependencies
FROM base AS prod-deps
ENV HUSKY=0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

# Stage 3: Build
FROM base AS build
ARG DB_PROVIDER=postgresql
ENV DB_PROVIDER=$DB_PROVIDER
ENV HUSKY=0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run prisma:gen && pnpm run build

# Stage 4: Runner
FROM base AS runner
ARG DB_PROVIDER=postgresql
ENV DB_PROVIDER=$DB_PROVIDER
ENV HUSKY=0
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001 -G nodejs
RUN mkdir -p /data && chown nestjs:nodejs /data

COPY --chown=nestjs:nodejs --from=prod-deps /app/node_modules ./node_modules
COPY --chown=nestjs:nodejs --from=build /app/dist ./dist
COPY --chown=nestjs:nodejs --from=build /app/package.json ./
COPY --chown=nestjs:nodejs --from=build /app/pnpm-workspace.yaml ./
COPY --chown=nestjs:nodejs --from=build /app/pnpm-lock.yaml ./
COPY --chown=nestjs:nodejs --from=build /app/prisma ./prisma
COPY --chown=nestjs:nodejs --from=build /app/tsconfig.json ./
COPY --chown=nestjs:nodejs --from=build /app/src/common ./src/common

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

USER nestjs
RUN pnpm run prisma:gen

WORKDIR /app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
