@echo off
chcp 65001 >nul
title Dong cac process dang dung port 5173 va 8000
echo ========================================
echo   DONG CAC PROCESS DANG DUNG PORT
echo ========================================
echo.

echo [1/2] Dang kiem tra va dong process dung port 5173 (Vite)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo [INFO] Tim thay process PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Da dong process %%a
    ) else (
        echo [!] Khong the dong process %%a (co the da dong)
    )
)

echo.
echo [2/2] Dang kiem tra va dong process dung port 8000 (Laravel)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo [INFO] Tim thay process PID: %%a
    taskkill /F /PID %%a >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Da dong process %%a
    ) else (
        echo [!] Khong the dong process %%a (co the da dong)
    )
)

echo.
echo ========================================
echo [HOAN TAT]
echo ========================================
echo.
echo Ban co the chay lai START.bat
echo.
pause

