@echo off
chcp 65001 >nul
title Cai dat Redis bang Docker
echo ========================================
echo    CAI DAT REDIS BANG DOCKER
echo ========================================
echo.

echo [1/3] Kiem tra Docker...
where docker >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Docker chua duoc cai dat!
    echo.
    echo Vui long cai dat Docker Desktop:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    echo Sau khi cai dat, khoi dong lai may va chay lai script nay.
    echo.
    pause
    exit /b 1
)

echo ✅ Docker da duoc cai dat.
echo.

echo [2/3] Kiem tra Docker da chay chua...
docker ps >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERROR: Docker chua chay!
    echo.
    echo Vui long:
    echo 1. Mo Docker Desktop
    echo 2. Doi cho Docker khoi dong xong
    echo 3. Chay lai script nay
    echo.
    pause
    exit /b 1
)

echo ✅ Docker da chay.
echo.

echo [3/3] Kiem tra Redis container...
docker ps -a | findstr redis >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Redis container da ton tai.
    echo.
    echo Ban muon:
    echo [1] Khoi dong Redis container (neu da dung)
    echo [2] Xoa va tao moi Redis container
    echo [3] Thoat
    echo.
    set /p choice="Lua chon (1/2/3): "
    
    if "!choice!"=="1" (
        echo.
        echo Dang khoi dong Redis container...
        docker start redis
        if %ERRORLEVEL% EQU 0 (
            echo ✅ Redis da duoc khoi dong!
        ) else (
            echo ❌ Khong the khoi dong Redis!
        )
        goto :test
    )
    
    if "!choice!"=="2" (
        echo.
        echo Dang xoa Redis container cu...
        docker stop redis >nul 2>&1
        docker rm redis >nul 2>&1
        goto :install
    )
    
    if "!choice!"=="3" (
        exit /b 0
    )
    
    goto :test
) else (
    :install
    echo.
    echo Dang tai va cai dat Redis container...
    echo (Co the mat vai phut lan dau tien...)
    echo.
    docker run -d -p 6379:6379 --name redis redis:latest
    
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ❌ ERROR: Khong the cai dat Redis!
        echo.
        echo Kiem tra:
        echo - Docker Desktop da mo chua?
        echo - Internet co ket noi khong?
        echo.
        pause
        exit /b 1
    )
    
    echo ✅ Redis da duoc cai dat thanh cong!
)

:test
echo.
echo ========================================
echo    KIEM TRA REDIS
echo ========================================
echo.

timeout /t 2 >nul

echo Dang test Redis...
docker exec redis redis-cli ping >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Redis da hoat dong!
    echo.
    echo Redis dang chay tren: localhost:6379
) else (
    echo ⚠️  Redis container da chay nhung chua san sang.
    echo Vui long doi vai giay va chay lai script nay.
)

echo.
echo ========================================
echo    CAU HINH LARAVEL
echo ========================================
echo.
echo Mo file .env va dam bao co cac dong sau:
echo.
echo CACHE_STORE=redis
echo REDIS_HOST=127.0.0.1
echo REDIS_PORT=6379
echo REDIS_PASSWORD=null
echo REDIS_DB=0
echo SESSION_DRIVER=redis
echo.
echo ========================================
echo.
pause

