@echo off
chcp 65001 >nul
title Tao thu muc can thiet
echo.
echo ╔═══════════════════════════════════════════════════════════════╗
echo ║          TAO CAC THU MUC CAN THIET                            ║
echo ╚═══════════════════════════════════════════════════════════════╝
echo.

echo [1] Tao bootstrap\cache...
if not exist "bootstrap\cache" mkdir "bootstrap\cache"
echo [OK] bootstrap\cache

echo [2] Tao storage\framework\cache\data...
if not exist "storage\framework\cache\data" mkdir "storage\framework\cache\data"
echo [OK] storage\framework\cache\data

echo [3] Tao storage\framework\sessions...
if not exist "storage\framework\sessions" mkdir "storage\framework\sessions"
echo [OK] storage\framework\sessions

echo [4] Tao storage\framework\views...
if not exist "storage\framework\views" mkdir "storage\framework\views"
echo [OK] storage\framework\views

echo [5] Tao storage\logs...
if not exist "storage\logs" mkdir "storage\logs"
echo [OK] storage\logs

echo.
echo ✅ DA TAO XONG TAT CA THU MUC CAN THIET!
echo.
pause

