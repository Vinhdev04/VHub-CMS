@echo off
echo ====================================
echo Pushing VHub CMS Code to GitHub
echo ====================================

git add .
git commit -m "feat(pwa): Add SVG Favicon, Apple Touch Icon and manifest.json for mobile home screen"
git push origin main

echo ====================================
echo Push completed. Render and Netlify will deploy shortly.
echo ====================================
pause
