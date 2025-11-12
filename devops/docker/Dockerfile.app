FROM node:24-alpine AS finance-bot-app

WORKDIR /app

# Copy package files
COPY src ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Build TypeScript to JavaScript
RUN npm run build

CMD ["node", "dist/index.js"]