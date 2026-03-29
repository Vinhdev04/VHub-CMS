# Production Auth Checklist

## Before Deploy

1. Confirm `ADMIN_EMAIL` matches the exact Google/GitHub email that should access the dashboard.
2. Confirm `SUPABASE_URL` and `VITE_SUPABASE_URL` point to the same Supabase project.
3. Confirm `SUPABASE_ANON_KEY` and `VITE_SUPABASE_ANON_KEY` use the same publishable key.
4. Confirm `FIREBASE_PRIVATE_KEY` is valid PEM format and does not contain placeholder text.
5. Confirm Netlify frontend uses the real backend URL in `VITE_API_BASE_URL`.
6. Confirm `netlify.toml` redirects `/api/*` to the real Render backend URL.

## Supabase Provider Setup

1. Google provider is enabled in Supabase.
2. GitHub provider is enabled in Supabase.
3. Supabase `Site URL` is set to the production frontend domain.
4. Supabase `Redirect URLs` include:
   - `https://vhub-cms.netlify.app`
   - `https://vhub-cms.netlify.app/auth/callback`
   - local URLs used in development

## Google OAuth Check

1. In Google Cloud, `Authorized JavaScript origins` includes:
   - `http://localhost:5173`
   - `https://vhub-cms.netlify.app`
2. In Google Cloud, `Authorized redirect URIs` includes:
   - `https://wkicfgmxyfwgmnplchmg.supabase.co/auth/v1/callback`

## GitHub OAuth Check

1. In GitHub OAuth App, `Homepage URL` is your frontend production URL.
2. In GitHub OAuth App, `Authorization callback URL` is:
   - `https://wkicfgmxyfwgmnplchmg.supabase.co/auth/v1/callback`

## Production Test Cases

1. Open the production frontend URL.
2. Verify the login page loads without console errors.
3. Test admin email/password login with the configured `ADMIN_EMAIL`.
4. Test login with a wrong admin password and verify it is rejected.
5. Test Google login with the admin Google account and verify redirect reaches dashboard.
6. Test GitHub login with the admin GitHub account and verify redirect reaches dashboard.
7. Test Google login with a non-admin email and verify access is rejected.
8. Test GitHub login with a non-admin email and verify access is rejected.
9. Open `Account` page and verify profile data loads.
10. Update account data and verify save works.
11. Refresh the dashboard after OAuth login and verify session persists.
12. Log out and verify protected routes redirect back to login.

## GitHub Actions Secrets

Add these repository secrets before using auto deploy workflows:

- `NETLIFY_AUTH_TOKEN`
- `NETLIFY_SITE_ID`
- `VITE_API_BASE_URL`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `RENDER_DEPLOY_HOOK_URL`
