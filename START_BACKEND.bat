@echo off
echo ============================================
echo   Starting Strapi Blog Backend
echo ============================================
cd /d "%~dp0my-blog-backend"

IF NOT EXIST node_modules (
  echo Installing dependencies (first run, takes ~2 min)...
  call npm install --legacy-peer-deps
)

echo.
echo Starting Strapi on http://localhost:1337
echo Admin panel: http://localhost:1337/admin
echo.
call npm run develop
pause
