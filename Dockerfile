# Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build Backend & Combine
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install

WORKDIR /app
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Set env
ENV NODE_ENV=production
ENV PORT=4000

# Start server
WORKDIR /app/backend
EXPOSE 4000
CMD ["node", "server.js"]
