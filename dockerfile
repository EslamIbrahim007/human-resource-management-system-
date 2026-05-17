# ---- Development ----
FROM node:20-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "run", "dev"]

# ---- Production ----
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs
EXPOSE 5000
CMD ["node", "dist/server.js"]