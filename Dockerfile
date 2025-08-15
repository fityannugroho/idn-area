# Use an official Node.js runtime as the base image
FROM node:20 AS builder

# Accept the database provider at build time so Prisma Client can be generated
ARG DB_PROVIDER
ENV DB_PROVIDER=$DB_PROVIDER

# Install pnpm and set the working directory inside the container
RUN npm install -g pnpm && mkdir -p /app
WORKDIR /app

# Copy package.json, pnpm-lock.yaml, and prisma directory to the working directory
COPY package.json pnpm-lock.yaml prisma ./

# Install the app dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Run the prisma generator and build the application
RUN pnpm run prisma:gen && pnpm run build

# Stage 2: A minimal Docker image with node and compiled app
FROM node:20

# Propagate DB_PROVIDER for runtime (optional; can still be overridden at run)
ARG DB_PROVIDER
ENV DB_PROVIDER=$DB_PROVIDER

# Install pnpm and set the working directory inside the container
RUN npm install -g pnpm && mkdir -p /app
WORKDIR /app

# Copy the necessary files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.* ./
COPY --from=builder /app/src/common ./src/common

# Expose the port that your NestJS app will listen on
EXPOSE 3000

# Start the application in production mode
CMD ["pnpm", "run", "start:prod"]
