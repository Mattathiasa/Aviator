@echo off
echo Killing old processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo Starting server...
start "Aviator Server" cmd /k "node server/index.js"

timeout /t 2 /nobreak >nul

echo Starting client...
start "Aviator Client" cmd /k "npm run dev"

echo.
echo ========================================
echo   Game Started!
echo   Open: http://localhost:8080
echo   Network: http://192.168.100.202:8080
echo ========================================
pause
