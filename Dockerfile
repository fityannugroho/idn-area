FROM node:22-alpine AS builder

# Accept the database provider at build time so Prisma Client can be generated
ARG DB_PROVIDER
ENV DB_PROVIDER=$DB_PROVIDER

# Skip husky hook setup inside build image
ENV HUSKY=0

RUN mkdir -p /app
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install the app dependencies
RUN corepack enable pnpm && pnpm install --frozen-lockfile

COPY . .

# Run the prisma generator and build the application
RUN pnpm run prisma:gen && pnpm run build

# Stage 2: A minimal Docker image with node and compiled app
FROM node:22-alpine AS runner

# Propagate DB_PROVIDER for runtime (optional; can still be overridden at run)
ARG DB_PROVIDER
ENV DB_PROVIDER=$DB_PROVIDER

# Skip husky hook setup inside build image
ENV HUSKY=0

# Install wget for health check and pnpm
RUN apk add --no-cache wget

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Set the working directory inside the container
RUN mkdir -p /app && chown -R nestjs:nodejs /app
WORKDIR /app

RUN corepack enable pnpm

# Switch to non-root user
USER nestjs

# Copy node_modules from builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy necessary files from builder stage
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.* ./
COPY --from=builder /app/src/common ./src/common

# Copy entrypoint script and make it executable
COPY docker-entrypoint.sh /usr/local/bin/
USER root
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
USER nestjs

# Expose the port that your NestJS app will listen on
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]
