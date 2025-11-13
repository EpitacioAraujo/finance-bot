FROM node:24-alpine AS finance-bot-app

WORKDIR /www

# Copy package files
COPY src .

# Install all dependencies (including devDependencies for building)
RUN npm install

RUN npm run build

CMD ["npm", "run", "start"]