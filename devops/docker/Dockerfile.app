# Multi-stage build for TypeScript Finance Bot
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files
COPY src/package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy TypeScript source code and config
COPY src/ .

# Build TypeScript to JavaScript
RUN npm run build

# Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Copy package files
COPY src/package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# Copy temp directory for runtime files
COPY src/temp ./temp

# Expose port
EXPOSE 3000

# Start the application using the compiled build output
CMD ["npm", "run", "start"]