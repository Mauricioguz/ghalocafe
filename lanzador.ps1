# Lanzador Inteligente La Leonora (PowerShell)
$ErrorActionPreference = 'Stop'

$baseDir = Get-Location
Write-Host '==========================================' -ForegroundColor Green
Write-Host '   INICIANDO LA LEONORA - GESTIÓN AGRO    ' -ForegroundColor Green
Write-Host '==========================================' -ForegroundColor Green
Write-Host "Directorio: $baseDir"

# --- LIMPIEZA DE PUERTOS ---
Write-Host 'Verificando puertos 8000 y 3000...' -ForegroundColor Cyan
$ports = @(8000, 3000, 3001)
foreach ($port in $ports) {
    try {
        $conn = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($conn) {
            $procId = $conn[0].OwningProcess
            Write-Host "[!] Liberando puerto $port (PID: $procId)..." -ForegroundColor Yellow
            Stop-Process -Id $procId -Force -ErrorAction SilentlyContinue
        }
    } catch {
        # Ignorar si no hay permisos o no existe el proceso
    }
}

# --- BACKEND ---
Write-Host "`n[1/2] Configurando Backend..." -ForegroundColor Cyan
$backendPath = Join-Path $baseDir 'backend'
Set-Location $backendPath

if (-not (Test-Path 'venv')) {
    Write-Host '[!] Creando entorno virtual...'
    python -m venv venv
}

Write-Host '[!] Asegurando librerías...'
$venvPython = Join-Path 'venv' 'Scripts\python.exe'
& $venvPython -m pip install -r requirements.txt

# Iniciar backend en ventana aparte
Write-Host '[!] Lanzando API...'
$cmdArgs = @('/k', 'title La Leonora - API & .\venv\Scripts\python main.py')
Start-Process 'cmd.exe' -ArgumentList $cmdArgs -WorkingDirectory $backendPath

# --- FRONTEND ---
Write-Host "`n[2/2] Configurando Frontend..." -ForegroundColor Cyan
$frontendPath = Join-Path $baseDir 'frontend'
Set-Location $frontendPath

if (-not (Test-Path 'node_modules')) {
    Write-Host '[!] Instalando componentes (primera vez)...'
    npm install
}

Write-Host '[!] Preparando Interfaz...' -ForegroundColor Yellow
# Abrir navegador en 2 segundos para dar tiempo al inicio
Start-Sleep -Seconds 2
Start-Process 'http://localhost:3000'

Write-Host '[!] Iniciando Servidor de Desarrollo...' -ForegroundColor Green
npm run dev
