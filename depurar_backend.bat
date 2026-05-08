@echo off
set "BASE_DIR=%~dp0"
cd /d "%BASE_DIR%backend"
echo Probando inicio del Backend...
echo ---------------------------------
venv\Scripts\python main.py
echo ---------------------------------
echo Si ves un error arriba, por favor toma una captura de pantalla.
pause
