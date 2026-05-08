@echo off
title La Leonora - Lanzador (Fase Final)
echo ==========================================
echo    INICIANDO LA LEONORA - GESTIÓN AGRO
echo ==========================================
echo.
echo Usando modo de compatibilidad PowerShell...
echo.

powershell -ExecutionPolicy Bypass -File "./lanzador.ps1"

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Hubo un problema al iniciar. Por favor toma captura de este mensaje.
    pause
)
