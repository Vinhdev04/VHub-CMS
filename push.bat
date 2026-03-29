@echo off
echo ====================================
echo Pushing VHub CMS Code to GitHub
echo ====================================

git add .
git commit -m "fix(auth): Merge API headers correctly to fix OAuth 401 Unauthorized"
git push origin main

echo ====================================
echo Push completed. Render and Netlify will deploy shortly.
echo ====================================
pause
