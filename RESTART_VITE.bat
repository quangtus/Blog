@echo off
chcp 65001 >nul
title Restart Vite Dev Server
echo ========================================
echo   RESTART VITE DEV SERVER
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Dang xoa Vite cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite" 2>nul
    echo [OK] Da xoa Vite cache
) else (
    echo [INFO] Khong co Vite cache
)

echo.
echo [2/3] Dang xoa public\hot...
if exist "public\hot" (
    del "public\hot" 2>nul
    echo [OK] Da xoa public\hot
)

echo.
echo [3/3] Dang khoi dong Vite dev server...
echo.
echo [!] Vite se chay tren http://localhost:5173
echo [!] Nhan Ctrl+C de dung server
echo.
echo ========================================
echo.

npm run dev

pause

