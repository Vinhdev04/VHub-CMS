# Build frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Build backend
FROM node:18-alpine
WORKDIR /app
COPY backend/package*.json ./backend/
RUN npm install --prefix backend
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

EXPOSE 5000
CMD ["npm", "start", "--prefix", "backend"]
