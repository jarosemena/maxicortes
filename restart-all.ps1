# Script para reiniciar todos los servicios en orden

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Reiniciando Servicios MaxiCortes" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Detener todos los servicios
Write-Host "1. Deteniendo servicios..." -ForegroundColor Yellow
docker compose down
Write-Host "✓ Servicios detenidos" -ForegroundColor Green
Write-Host ""

# Iniciar PostgreSQL primero
Write-Host "2. Iniciando PostgreSQL..." -ForegroundColor Yellow
docker compose up -d postgres
Write-Host "✓ PostgreSQL iniciado" -ForegroundColor Green
Write-Host ""

# Esperar a que PostgreSQL esté listo
Write-Host "3. Esperando a que PostgreSQL esté listo..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0
$pgReady = $false

while ($attempt -lt $maxAttempts -and -not $pgReady) {
    Start-Sleep -Seconds 2
    $health = docker inspect --format='{{.State.Health.Status}}' maxicortes-postgres 2>$null
    if ($health -eq "healthy") {
        $pgReady = $true
    } else {
        Write-Host "." -NoNewline
        $attempt++
    }
}

Write-Host ""
if ($pgReady) {
    Write-Host "✓ PostgreSQL está listo" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL tardó más de lo esperado" -ForegroundColor Yellow
}
Write-Host ""

# Reconstruir e iniciar backend
Write-Host "4. Reconstruyendo e iniciando Backend..." -ForegroundColor Yellow
docker compose up --build -d backend
Write-Host "✓ Backend iniciado" -ForegroundColor Green
Write-Host ""

# Esperar a que backend esté listo
Write-Host "5. Esperando a que Backend esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

$backendHealth = docker inspect --format='{{.State.Health.Status}}' maxicortes-backend 2>$null
Write-Host "   Estado del backend: $backendHealth" -ForegroundColor Gray
Write-Host ""

# Iniciar frontend
Write-Host "6. Iniciando Frontend..." -ForegroundColor Yellow
docker compose up -d frontend
Write-Host "✓ Frontend iniciado" -ForegroundColor Green
Write-Host ""

# Mostrar estado final
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Estado Final" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

docker compose ps

Write-Host ""
Write-Host "Verificando endpoints..." -ForegroundColor Yellow
Write-Host ""

# Probar health check
try {
    $health = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Backend Health: OK" -ForegroundColor Green
} catch {
    Write-Host "✗ Backend Health: FALLO" -ForegroundColor Red
    Write-Host "  Ver logs: docker compose logs backend" -ForegroundColor Yellow
}

# Probar Swagger
try {
    $swagger = Invoke-WebRequest -Uri "http://localhost:5000/swagger" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Swagger: OK - http://localhost:5000/swagger" -ForegroundColor Green
} catch {
    Write-Host "✗ Swagger: FALLO" -ForegroundColor Red
    Write-Host "  Ver logs: docker compose logs backend" -ForegroundColor Yellow
}

# Probar Frontend
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Frontend: OK - http://localhost:5173" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend: FALLO" -ForegroundColor Red
}

Write-Host ""
Write-Host "Para ver logs en tiempo real:" -ForegroundColor Cyan
Write-Host "  docker compose logs -f backend" -ForegroundColor Gray
Write-Host ""
