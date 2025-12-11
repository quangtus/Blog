@echo off
chcp 65001 >nul
title Laravel Blog - Khoi dong du an
color 0A

echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║          LARAVEL BLOG - KHOI DONG DU AN                      ║
echo ║   Laravel + React + MongoDB + Redis                          ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

:: ========================================
:: KIEM TRA CAC PHAN MEM CAN THIET
:: ========================================
echo [KIEM TRA HE THONG]
echo.

:: Kiem tra PHP (bao gom ca XAMPP)
where php >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    :: Neu khong tim thay php trong PATH, thu tim trong XAMPP
    if exist "C:\xampp\php\php.exe" (
        echo [!] PHP tim thay trong XAMPP, dang them vao PATH tam thoi...
        set "PATH=%PATH%;C:\xampp\php"
    ) else (
        echo [X] PHP chua duoc cai dat!
        echo     Cach 1: Cai XAMPP tai https://www.apachefriends.org/
        echo     Cach 2: Cai PHP tai https://www.php.net/downloads.php
        pause
        exit /b 1
    )
)
for /f "tokens=2" %%i in ('php -v 2^>nul ^| findstr /R "^PHP"') do set PHP_VER=%%i
echo [OK] PHP: %PHP_VER%

:: Kiem tra Composer
where composer >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    :: Thu tim trong XAMPP
    if exist "C:\xampp\php\composer.bat" (
        echo [!] Composer tim thay trong XAMPP
    ) else (
        echo [X] Composer chua duoc cai dat!
        echo     Tai tai: https://getcomposer.org/download/
        pause
        exit /b 1
    )
)
echo [OK] Composer da cai dat

:: Kiem tra Node.js
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js chua duoc cai dat!
    echo     Tai tai: https://nodejs.org/
    pause
    exit /b 1
)
for /f "tokens=1" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js: %NODE_VER%

:: Kiem tra Docker (cho MongoDB va Redis)
where docker >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] Docker chua cai - Can Docker de chay MongoDB va Redis
    echo     Tai tai: https://www.docker.com/products/docker-desktop/
    echo.
    set DOCKER_OK=0
) else (
    docker ps >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo [!] Docker chua chay - Vui long mo Docker Desktop
        set DOCKER_OK=0
    ) else (
        echo [OK] Docker dang chay
        set DOCKER_OK=1
    )
)

echo.
echo ========================================
echo [CAI DAT DEPENDENCIES]
echo ========================================
echo.

:: Cai dat Composer dependencies
if not exist vendor (
    echo Dang cai dat PHP dependencies...
    call "C:\xampp\php\composer.bat" install
    if %ERRORLEVEL% NEQ 0 (
        echo [X] Loi cai dat Composer!
        pause
        exit /b 1
    )
) else (
    echo [OK] PHP dependencies da co
)

:: Cai dat Node.js dependencies
if not exist node_modules (
    echo Dang cai dat Node.js dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [X] Loi cai dat npm!
        pause
        exit /b 1
    )
) else (
    echo [OK] Node.js dependencies da co
)

echo.
echo ========================================
echo [CAU HINH MOI TRUONG]
echo ========================================
echo.

:: Tao file .env neu chua co
if not exist .env (
    echo Tao file .env tu .env.example...
    copy .env.example .env >nul
)
echo [OK] File .env da co

:: Tao APP_KEY neu chua co
findstr /C:"APP_KEY=$" .env >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo Dang tao Application Key...
    where php >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        if exist "C:\xampp\php\php.exe" (
            set "PATH=%PATH%;C:\xampp\php"
        )
    )
    php artisan key:generate --ansi
    if %ERRORLEVEL% NEQ 0 (
        echo [X] Khong the tao APP_KEY! Vui long chay: TAO_APP_KEY.bat
    )
)
findstr /C:"APP_KEY=base64:" .env >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Application Key da co
) else (
    echo [!] APP_KEY chua duoc tao! Vui long chay: TAO_APP_KEY.bat
)

echo.
echo ========================================
echo [TAO THU MUC CAN THIET]
echo ========================================
echo.

:: Tao bootstrap\cache
if not exist "bootstrap\cache" (
    mkdir "bootstrap\cache" 2>nul
    echo [OK] Da tao bootstrap\cache
)

:: Tao storage directories
if not exist "storage\framework\cache\data" mkdir "storage\framework\cache\data" 2>nul
if not exist "storage\framework\sessions" mkdir "storage\framework\sessions" 2>nul
if not exist "storage\framework\views" mkdir "storage\framework\views" 2>nul
if not exist "storage\logs" mkdir "storage\logs" 2>nul
echo [OK] Cac thu muc storage da co

echo.
echo ========================================
echo [KHOI DONG MONGODB VA REDIS]
echo ========================================
echo.

if "%DOCKER_OK%"=="1" (
    :: Kiem tra va khoi dong MongoDB
    docker ps -a | findstr mongodb >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        docker ps | findstr mongodb >nul 2>&1
        if %ERRORLEVEL% NEQ 0 (
            echo Dang khoi dong MongoDB container...
            docker start mongodb >nul 2>&1
        )
        echo [OK] MongoDB dang chay - Port: 27017
    ) else (
        echo Dang tao MongoDB container...
        docker run -d -p 27017:27017 --name mongodb mongo:latest >nul 2>&1
        echo [OK] MongoDB da tao va chay - Port: 27017
    )

    :: Kiem tra va khoi dong Redis
    docker ps -a | findstr redis >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        docker ps | findstr redis >nul 2>&1
        if %ERRORLEVEL% NEQ 0 (
            echo Dang khoi dong Redis container...
            docker start redis >nul 2>&1
        )
        echo [OK] Redis dang chay - Port: 6379
    ) else (
        echo Dang tao Redis container...
        docker run -d -p 6379:6379 --name redis redis:latest >nul 2>&1
        echo [OK] Redis da tao va chay - Port: 6379
    )
) else (
    echo [!] Docker khong kha dung, vui long khoi dong MongoDB va Redis thu cong
    echo     MongoDB: port 27017
    echo     Redis: port 6379
)

echo.
echo ========================================
echo [KHOI DONG SERVER]
echo ========================================
echo.
echo Dang khoi dong Laravel (Backend) va Vite (Frontend)...
echo.
echo +-------------------------------------------------+
echo ^|  THONG TIN TRUY CAP:                            ^|
echo ^|                                                 ^|
echo ^|  Web App:     http://localhost:8000             ^|
echo ^|  API:         http://localhost:8000/api         ^|
echo ^|  Vite HMR:    http://localhost:5173             ^|
echo ^|                                                 ^|
echo ^|  MongoDB:     localhost:27017                   ^|
echo ^|  Redis:       localhost:6379                    ^|
echo +-------------------------------------------------+
echo.
echo [!] Nhan Ctrl+C de dung server
echo.

:: Kiem tra file artisan
if not exist artisan (
    echo [X] LOI: Khong tim thay file artisan!
    echo     File artisan la file quan trong cua Laravel.
    echo     Vui long kiem tra lai thu muc du an.
    pause
    exit /b 1
)

:: Chuyen den thu muc du an (dam bao chay tu thu muc dung)
cd /d "%~dp0"

:: Dong tat ca Node.js process (Vite) truoc
echo Dang dong tat ca Node.js process (Vite)...
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Da dong tat ca Node.js process
) else (
    echo [INFO] Khong co Node.js process nao dang chay
)

:: Kiem tra va dong process dang dung port 5173 (Vite)
echo Dang kiem tra port 5173 (Vite)...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo [INFO] Tim thay process dang dung port 5173: %%a
    echo [INFO] Dang dong process...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 /nobreak >nul
)

:: Kiem tra va dong process dang dung port 8000 (Laravel)
echo Dang kiem tra port 8000 (Laravel)...
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo [INFO] Tim thay process dang dung port 8000: %%a
    echo [INFO] Dang dong process...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 1 /nobreak >nul
)

:: Xoa Vite cache neu can
if exist "node_modules\.vite" (
    echo [INFO] Dang xoa Vite cache...
    rmdir /s /q "node_modules\.vite" >nul 2>&1
)

:: Xoa file hot neu can
if exist "public\hot" (
    del "public\hot" >nul 2>&1
)

:: Doi 3 giay de dam bao process da dong hoan toan
echo Dang doi process dong hoan toan...
timeout /t 3 /nobreak >nul

:: Kiem tra lai port 5173 - phai trong truoc khi start
echo Dang kiem tra lai port 5173...
set PORT_5173_FREE=1
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo [LOI] Port 5173 van dang duoc su dung boi PID: %%a
    echo [INFO] Vui long chay KILL_VITE.bat hoac dong process thu cong
    set PORT_5173_FREE=0
)

if "%PORT_5173_FREE%"=="0" (
    echo.
    echo [X] KHONG THE KHOI DONG VITE!
    echo     Port 5173 van dang duoc su dung.
    echo     Vui long:
    echo     1. Chay KILL_VITE.bat
    echo     2. Hoac dong tat ca cua so CMD/Terminal khac
    echo     3. Chay lai START.bat
    echo.
    pause
    exit /b 1
)

:: Kiem tra lai port 8000 - phai trong truoc khi start
echo Dang kiem tra lai port 8000...
set PORT_8000_FREE=1
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":8000" ^| findstr "LISTENING"') do (
    echo [LOI] Port 8000 van dang duoc su dung boi PID: %%a
    echo [INFO] Dang dong process...
    taskkill /F /PID %%a >nul 2>&1
    timeout /t 2 /nobreak >nul
)

:: Khoi dong Vite trong background
echo [OK] Port 5173 da trong, dang khoi dong Vite...
start "Vite Dev Server" cmd /k "cd /d %~dp0 && npm run dev"

:: Doi 5 giay de Vite khoi dong hoan toan
echo Dang doi Vite khoi dong (5 giay)...
timeout /t 5 /nobreak >nul

:: Kiem tra Vite da chay chua
echo Dang kiem tra Vite da chay...
set VITE_RUNNING=0
for /f "tokens=5" %%a in ('netstat -aon 2^>nul ^| findstr ":5173" ^| findstr "LISTENING"') do (
    echo [OK] Vite da chay tren port 5173 (PID: %%a)
    set VITE_RUNNING=1
)

if "%VITE_RUNNING%"=="0" (
    echo [!] Vite co the chua khoi dong xong, nhung se tiep tuc...
)

:: Khoi dong Laravel (foreground)
echo Dang khoi dong Laravel...
php artisan serve

pause
