# VHub CMS Dashboard

Boilerplate fullstack CMS admin dashboard for developer portfolio.

## Stack

- Frontend: ReactJS + Ant Design + CSS
- Backend: NodeJS (Express) + Supabase

## Folder Structure

```text
frontend/
  src/
    components/layout/      # Reusable UI layout blocks
    layouts/                # Page-level layout containers
    modules/projects/       # Feature module: projects
      components/           # UI components of module
      data/                 # Static resources (if needed)
      hooks/                # React hooks for module logic
      pages/                # Screen-level components
      services/             # API/data service layer
    shared/config/          # App configuration
    styles/                 # Global stylesheet

backend/
  config/                   # Environment config
  controller/               # Route controllers
  helpers/                  # Services, repositories, mocks
  lib/                      # Firebase and Supabase clients
  middleware/               # App middlewares
  routes/                   # Express routes
```

## Run Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Run Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

## Notes

- Frontend gọi API thật qua `VITE_API_BASE_URL` (mặc định `http://localhost:4000`).
- Nếu chưa cấu hình Supabase, backend sẽ tự fallback dữ liệu mẫu để UI vẫn hoạt động khi dev.

## API

- `GET /health`
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `GET /api/blog-posts`
- `POST /api/blog-posts`
- `PUT /api/blog-posts/:id`
- `DELETE /api/blog-posts/:id`

## Docker

Build image:

```bash
docker build -t vhub-cms .
```

Run container:

```bash
docker run -p 4000:4000 --env-file backend/.env vhub-cms
```

Run with Docker Compose:

```bash
docker compose up --build
```

## Docker Hub

Login:

```bash
docker login
```

Tag image:

```bash
docker tag vhub-cms <dockerhub-username>/vhub-cms:latest
```

Push image:

```bash
docker push <dockerhub-username>/vhub-cms:latest
```

Example CI/CD flow:

```bash
docker build -t <dockerhub-username>/vhub-cms:latest .
docker push <dockerhub-username>/vhub-cms:latest
```
