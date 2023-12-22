# Use an official Node.js runtime as the base image
FROM node:18 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY prisma ./prisma/

# Install the app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run the prisma generator
RUN npm run prisma:gen

# Build the application
RUN npm run build

# Stage 2: A minimal Docker image with node and compiled app
FROM node:18

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Expose the port that your NestJS app will listen on
EXPOSE 3000

# Start the application in production mode
CMD ["npm", "run", "start:prod"]
