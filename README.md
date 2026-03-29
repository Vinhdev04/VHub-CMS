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

## Supabase Auth Setup

Update local env:

```bash
backend/.env
frontend/.env
```

Required values:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_publishable_key
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_publishable_key
ADMIN_EMAIL=your-admin-email@example.com
```

### Google Provider

1. Open Supabase Dashboard.
2. Go to `Authentication` -> `Providers`.
3. Enable `Google`.
4. In Google Cloud Console, create OAuth credentials for Web application.
5. Add Supabase callback URL shown in provider screen into Google OAuth redirect URIs.
6. Copy `Client ID` and `Client Secret` from Google Cloud into Supabase Google provider form.
7. Save provider config.

### GitHub Provider

1. Open Supabase Dashboard.
2. Go to `Authentication` -> `Providers`.
3. Enable `GitHub`.
4. In GitHub Developer Settings, create a new OAuth App.
5. Set Authorization callback URL to the Supabase callback URL shown in provider screen.
6. Copy `Client ID` and `Client Secret` from GitHub into Supabase GitHub provider form.
7. Save provider config.

### Redirect URLs

Add these URLs in Supabase `Authentication` -> `URL Configuration`:

```text
http://localhost:5173
http://localhost:5173/auth/callback
http://localhost:4000
http://localhost:4000/auth/callback
```

For production, add your deployed frontend domain and callback URL too.

Google OAuth callback URL in Supabase provider screen usually has the form:

```text
https://wkicfgmxyfwgmnplchmg.supabase.co/auth/v1/callback
```

When creating the Google OAuth client:

```text
Application type: Web application
Name: vhub-cms
Authorized JavaScript origins:
- http://localhost:5173
- https://vhub-cms.netlify.app

Authorized redirect URIs:
- https://wkicfgmxyfwgmnplchmg.supabase.co/auth/v1/callback
```

For GitHub OAuth app:

```text
Homepage URL:
- https://vhub-cms.netlify.app

Authorization callback URL:
- https://wkicfgmxyfwgmnplchmg.supabase.co/auth/v1/callback
```

### Admin Access Rule

Only the email configured in `ADMIN_EMAIL` can access the dashboard.
If Google or GitHub login returns a different email, backend will reject it.

## Netlify Deploy

This repo now includes [netlify.toml](/d:/VHub-CMS-clean/netlify.toml) for frontend deploy.

Netlify UI values:

```text
Branch to deploy: main
Base directory: frontend
Build command: npm ci && npm run build
Publish directory: frontend/dist
```

Netlify environment variables:

```text
VITE_API_BASE_URL=https://your-backend-service.onrender.com
VITE_SUPABASE_URL=https://wkicfgmxyfwgmnplchmg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_elv4WKICRFi5ao9EietL_w_zeBueNAI
```

Important:

```text
Update the /api redirect in netlify.toml to your real backend Render URL.
```

## Render Deploy

This repo now includes [render.yaml](/d:/VHub-CMS-clean/render.yaml) for backend deploy with Docker.

Render UI values:

```text
Language: Docker
Branch: main
Root Directory: leave empty
Dockerfile Path: ./Dockerfile
```

Render environment variables:

```text
PORT=4000
NODE_ENV=production
SUPABASE_URL=https://wkicfgmxyfwgmnplchmg.supabase.co
SUPABASE_ANON_KEY=sb_publishable_elv4WKICRFi5ao9EietL_w_zeBueNAI
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-admin-password
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_service_account_email
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
VITE_API_BASE_URL=https://your-backend-service.onrender.com
VITE_SUPABASE_URL=https://wkicfgmxyfwgmnplchmg.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_elv4WKICRFi5ao9EietL_w_zeBueNAI
```
