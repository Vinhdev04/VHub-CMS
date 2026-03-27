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
  src/
    config/                 # Environment and Supabase clients
    modules/projects/       # Feature module: projects API
      projects.routes.js
      projects.controller.js
      projects.service.js
      projects.repository.js
    shared/
      middlewares/          # App middlewares
      utils/                # Shared helpers
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
