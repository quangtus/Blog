@echo off
chcp 65001 >nul
title Kiem tra toan bo du an
color 0B
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║          KIEM TRA TOAN BO DU AN                              ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

set ERRORS=0
set FIXED=0

cd /d "%~dp0"

echo [1] Kiem tra file quan trong...
if not exist artisan (
    echo [X] Thieu: artisan
    set /a ERRORS+=1
) else (
    echo [OK] artisan
)

if not exist "resources\js\app.jsx" (
    echo [X] Thieu: resources\js\app.jsx
    set /a ERRORS+=1
) else (
    echo [OK] resources\js\app.jsx
)

if not exist "resources\js\App.jsx" (
    echo [X] Thieu: resources\js\App.jsx
    set /a ERRORS+=1
) else (
    echo [OK] resources\js\App.jsx
)

if not exist "config\app.php" (
    echo [X] Thieu: config\app.php
    set /a ERRORS+=1
) else (
    echo [OK] config\app.php
)

echo.
echo [2] Kiem tra thu muc can thiet...
if not exist "bootstrap\cache" (
    echo [!] Thieu: bootstrap\cache - Dang tao...
    mkdir "bootstrap\cache" 2>nul
    set /a FIXED+=1
) else (
    echo [OK] bootstrap\cache
)

if not exist "storage\framework\cache\data" (
    echo [!] Thieu: storage\framework\cache\data - Dang tao...
    mkdir "storage\framework\cache\data" 2>nul
    set /a FIXED+=1
) else (
    echo [OK] storage\framework\cache\data
)

if not exist "storage\framework\sessions" (
    echo [!] Thieu: storage\framework\sessions - Dang tao...
    mkdir "storage\framework\sessions" 2>nul
    set /a FIXED+=1
) else (
    echo [OK] storage\framework\sessions
)

if not exist "storage\framework\views" (
    echo [!] Thieu: storage\framework\views - Dang tao...
    mkdir "storage\framework\views" 2>nul
    set /a FIXED+=1
) else (
    echo [OK] storage\framework\views
)

if not exist "app\Console\Commands" (
    echo [!] Thieu: app\Console\Commands - Dang tao...
    mkdir "app\Console\Commands" 2>nul
    set /a FIXED+=1
) else (
    echo [OK] app\Console\Commands
)

echo.
echo [3] Kiem tra APP_KEY...
findstr /C:"APP_KEY=$" .env >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [!] APP_KEY chua duoc tao - Dang tao...
    php artisan key:generate --ansi >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Da tao APP_KEY
        set /a FIXED+=1
    ) else (
        echo [X] Khong the tao APP_KEY
        set /a ERRORS+=1
    )
) else (
    echo [OK] APP_KEY da co
)

echo.
echo [4] Kiem tra dependencies...
if not exist vendor (
    echo [X] Thieu: vendor folder
    set /a ERRORS+=1
) else (
    echo [OK] vendor
)

if not exist node_modules (
    echo [X] Thieu: node_modules folder
    set /a ERRORS+=1
) else (
    echo [OK] node_modules
)

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
if %ERRORS% EQU 0 (
    if %FIXED% GTR 0 (
        echo ║  ✅ DA SUA %FIXED% VAN DE! Du an san sang!                ║
    ) else (
        echo ║  ✅ DU AN HOAN TOAN SAN SANG!                            ║
    )
) else (
    echo ║  ❌ CON %ERRORS% LOI CAN SUA!                               ║
)
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

if %ERRORS% GTR 0 (
    echo Cac loi can sua thu cong:
    echo - Kiem tra lai cac file bi thieu
    echo - Chay: composer install (neu thieu vendor)
    echo - Chay: npm install (neu thieu node_modules)
)

echo.
pause

