@echo off
set "BASE_DIR=%~dp0"
cd /d "%BASE_DIR%"

title Diagnóstico de Sistema - La Leonora
echo ==========================================
echo    DIAGNÓSTICO DE REQUISITOS
echo ==========================================
echo.

echo [1] Verificando Versiones:
echo - Python:
python --version || echo [!] Python no encontrado. Prueba instalando desde python.org
echo - Node.js:
node -v || echo [!] Node.js no encontrado. Prueba instalando desde nodejs.org
echo - NPM:
npm -v || echo [!] NPM no encontrado.
echo.

echo [2] Verificando Carpetas:
if exist "backend" (echo [OK] Carpeta /backend existe) else (echo [!] FALTA carpeta /backend)
if exist "frontend" (echo [OK] Carpeta /frontend existe) else (echo [!] FALTA carpeta /frontend)
echo.

echo [3] Probando Backend Manual (en esta ventana):
echo (Presiona Ctrl+C para detener si funciona)
timeout /t 2 > nul
if exist "backend\venv\Scripts\python.exe" (
    echo Usando entorno virtual existente...
    backend\venv\Scripts\python backend\main.py
) else (
    echo No hay entorno virtual. Probando python global...
    python backend\main.py
)

echo.
echo ==========================================
echo    ANÁLISIS COMPLETADO
echo ==========================================
echo Si viste algun error arriba, toma captura.
pause
