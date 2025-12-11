@echo off
chcp 65001 >nul
title Dong tat ca Vite va Laravel process
echo ========================================
echo   DONG TAT CA VITE VA LARAVEL PROCESS
echo ========================================
echo.

echo [1/4] Dang tim va dong process dung port 5173 (Vite)...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo [INFO] Tim thay process PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Da dong process %%a
    ) else (
        echo [!] Khong the dong process %%a
    )
)

echo.
echo [2/4] Dang tim va dong process dung port 8000 (Laravel)...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo [INFO] Tim thay process PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Da dong process %%a
    ) else (
        echo [!] Khong the dong process %%a
    )
)

echo.
echo [3/4] Dang dong tat ca Node.js process (Vite)...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Da dong tat ca Node.js process
) else (
    echo [INFO] Khong co Node.js process nao dang chay
)

echo.
echo [4/4] Dang xoa cache...
if exist "node_modules\.vite" (
    rmdir /s /q "node_modules\.vite" >nul 2>&1
    echo [OK] Da xoa Vite cache
)
if exist "public\hot" (
    del "public\hot" >nul 2>&1
    echo [OK] Da xoa public\hot
)

echo.
echo ========================================
echo [HOAN TAT]
echo ========================================
echo.
echo Ban co the chay lai START.bat
echo.
timeout /t 2 >nul

