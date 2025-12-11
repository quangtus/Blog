@echo off
chcp 65001 >nul
title Cai dat Predis (Redis client cho PHP)
echo ========================================
echo   CAI DAT PREDIS (REDIS CLIENT)
echo ========================================
echo.
echo Predis la Redis client bang PHP thuan (khong can extension)
echo.

cd /d "%~dp0"

REM Kiem tra PHP
where php >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    if exist "C:\xampp\php\php.exe" (
        set "PATH=%PATH%;C:\xampp\php"
        set PHP_CMD=C:\xampp\php\php.exe
        set COMPOSER_CMD=C:\xampp\php\composer.phar
    ) else (
        echo [LOI] Khong tim thay PHP!
        echo Vui long cai dat PHP hoac XAMPP
        pause
        exit /b 1
    )
) else (
    set PHP_CMD=php
    where composer >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        set COMPOSER_CMD=composer
    ) else (
        if exist "C:\xampp\php\composer.phar" (
            set COMPOSER_CMD=C:\xampp\php\composer.phar
        ) else (
            echo [LOI] Khong tim thay Composer!
            pause
            exit /b 1
        )
    )
)

echo [INFO] Dang cai dat predis/predis...
echo.

%PHP_CMD% %COMPOSER_CMD% require predis/predis --no-interaction

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo [OK] DA CAI DAT PREDIS THANH CONG!
    echo ========================================
    echo.
    echo Dang cap nhat file .env...
    
    REM Cap nhat REDIS_CLIENT trong .env
    if exist ".env" (
        powershell -Command "(Get-Content .env) -replace 'REDIS_CLIENT=phpredis', 'REDIS_CLIENT=predis' | Set-Content .env"
        echo [OK] Da cap nhat REDIS_CLIENT=predis trong .env
    ) else (
        echo [!] Khong tim thay file .env
    )
    
    echo.
    echo ========================================
    echo [HOAN TAT]
    echo ========================================
    echo.
    echo Ban co the refresh trang http://localhost:8000
    echo.
) else (
    echo.
    echo ========================================
    echo [LOI] KHONG THE CAI DAT PREDIS
    echo ========================================
    echo.
    echo Vui long kiem tra:
    echo   1. Composer da duoc cai dat
    echo   2. Internet co ket noi
    echo   3. Chay lai script nay
    echo.
)

pause

