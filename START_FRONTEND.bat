@echo off
echo ============================================
echo   Starting Nuxt Blog Frontend
echo ============================================
cd /d "%~dp0my-blog-frontend"

IF NOT EXIST node_modules (
  echo Installing dependencies (first run, takes ~1 min)...
  call npm install
)

echo.
echo Starting Nuxt on http://localhost:3000
echo.
call npm run dev
pause
