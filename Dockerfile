# Use an official Node.js runtime as the base image
FROM node:18 AS builder

# Install pnpm
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install the app dependencies
RUN pnpm install

# Copy the rest of the application code
COPY . .

# Run the prisma generator
RUN pnpm run prisma:gen

# Build the application
RUN pnpm run build

# Stage 2: A minimal Docker image with node and compiled app
FROM node:18

# Install pnpm
RUN npm install -g pnpm

# Set the working directory inside the container
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/tsconfig.* ./
COPY --from=builder /app/common ./common

# Expose the port that your NestJS app will listen on
EXPOSE 3000

# Start the application in production mode
CMD ["pnpm", "run", "start:prod"]
