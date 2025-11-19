@echo off
echo ========================================
echo   Starting Aviator Multiplayer Game
echo ========================================
echo.

REM Get local IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%

echo Your PC IP Address: %IP%
echo.
echo Server will run on: http://%IP%:3001
echo Client will run on: http://%IP%:5173
echo.
echo Tell your friends to open: http://%IP%:5173
echo.
echo ========================================
echo.

REM Start server in new window
start "Aviator Server" cmd /k "node server/index.js"

REM Wait 2 seconds for server to start
timeout /t 2 /nobreak >nul

REM Start client
echo Starting client...
npm run dev

pause
