@echo off
chcp 65001 >nul
echo ========================================
echo   TAO APP_KEY CHO LARAVEL
echo ========================================
echo.

cd /d "%~dp0"

REM Kiem tra file .env
if not exist ".env" (
    echo [LOI] Khong tim thay file .env
    echo Tao file .env tu .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo [OK] Da tao file .env
    ) else (
        echo [LOI] Khong tim thay .env.example
        pause
        exit /b 1
    )
)

REM Kiem tra artisan
if not exist "artisan" (
    echo [LOI] Khong tim thay file artisan
    pause
    exit /b 1
)

REM Kiem tra PHP
where php >nul 2>&1
if %errorlevel% neq 0 (
    echo [LOI] Khong tim thay PHP trong PATH
    echo.
    echo Thu tim PHP trong cac thu muc pho bien:
    set PHP_PATHS=C:\xampp\php\php.exe C:\laragon\bin\php\php-8.1.10-Win32-vs16-x64\php.exe C:\wamp64\bin\php\php8.1.0\php.exe
    set PHP_FOUND=0
    
    for %%P in (%PHP_PATHS%) do (
        if exist "%%P" (
            echo [OK] Tim thay PHP: %%P
            set PHP_CMD=%%P
            set PHP_FOUND=1
            goto :found_php
        )
    )
    
    :found_php
    if %PHP_FOUND% equ 0 (
        echo [LOI] Khong tim thay PHP. Vui long cai dat PHP hoac them vao PATH
        pause
        exit /b 1
    )
) else (
    set PHP_CMD=php
)

echo [INFO] Dang tao APP_KEY...
echo.

REM Tao APP_KEY
%PHP_CMD% artisan key:generate --ansi

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo [OK] DA TAO APP_KEY THANH CONG!
    echo ========================================
    echo.
    echo Kiem tra file .env, ban se thay:
    echo   APP_KEY=base64:xxxxxxxxxxxxxxxxxxxxx
    echo.
) else (
    echo.
    echo ========================================
    echo [LOI] KHONG THE TAO APP_KEY
    echo ========================================
    echo.
    echo Vui long kiem tra:
    echo   1. PHP da duoc cai dat
    echo   2. Composer dependencies da duoc cai dat (chay: composer install)
    echo   3. File artisan ton tai
    echo.
)

pause
