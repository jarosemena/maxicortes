# MaxiCortes - Script para iniciar con Docker Compose

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MaxiCortes - Docker Compose" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Docker
Write-Host "Verificando Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker no encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor instala Docker Desktop:" -ForegroundColor Yellow
    Write-Host "https://www.docker.com/products/docker-desktop" -ForegroundColor Blue
    Write-Host ""
    exit 1
}

# Verificar Docker Compose
try {
    $composeVersion = docker compose version
    Write-Host "✓ Docker Compose: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker Compose no encontrado" -ForegroundColor Red
    Write-Host ""
    Write-Host "Docker Compose viene incluido con Docker Desktop" -ForegroundColor Yellow
    Write-Host "Asegúrate de tener Docker Desktop actualizado" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Iniciando Servicios" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Esto puede tomar varios minutos la primera vez..." -ForegroundColor Yellow
Write-Host "Docker necesita descargar las imágenes y compilar los contenedores" -ForegroundColor Gray
Write-Host ""

# Iniciar servicios con docker-compose
Write-Host "Ejecutando: docker compose up --build -d" -ForegroundColor Cyan
Write-Host ""

docker compose up --build -d

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ Error iniciando los servicios" -ForegroundColor Red
    Write-Host ""
    Write-Host "Comandos útiles para diagnosticar:" -ForegroundColor Yellow
    Write-Host "  docker compose logs           - Ver todos los logs" -ForegroundColor Gray
    Write-Host "  docker compose logs backend   - Ver logs del backend" -ForegroundColor Gray
    Write-Host "  docker compose logs frontend  - Ver logs del frontend" -ForegroundColor Gray
    Write-Host "  docker compose ps             - Ver estado de contenedores" -ForegroundColor Gray
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Esperando a que los servicios estén listos..." -ForegroundColor Yellow
Write-Host ""

# Esperar a que los servicios estén saludables
$maxAttempts = 60
$attempt = 0
$allHealthy = $false

while ($attempt -lt $maxAttempts -and -not $allHealthy) {
    Start-Sleep -Seconds 2
    
    # Verificar estado de los contenedores
    $postgresHealth = docker inspect --format='{{.State.Health.Status}}' maxicortes-postgres 2>$null
    $backendHealth = docker inspect --format='{{.State.Health.Status}}' maxicortes-backend 2>$null
    $frontendHealth = docker inspect --format='{{.State.Health.Status}}' maxicortes-frontend 2>$null
    
    if ($postgresHealth -eq "healthy" -and $backendHealth -eq "healthy" -and $frontendHealth -eq "healthy") {
        $allHealthy = $true
    } else {
        Write-Host "." -NoNewline
        $attempt++
    }
}

Write-Host ""
Write-Host ""

if ($allHealthy) {
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  ¡Servicios Listos!" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "✓ PostgreSQL:  localhost:5432" -ForegroundColor Green
    Write-Host "✓ Backend API: http://localhost:5000" -ForegroundColor Green
    Write-Host "✓ Swagger UI:  http://localhost:5000/swagger" -ForegroundColor Green
    Write-Host "✓ Frontend:    http://localhost:5173" -ForegroundColor Green
    Write-Host ""
    Write-Host "Comandos útiles:" -ForegroundColor Cyan
    Write-Host "  docker compose ps              - Ver estado" -ForegroundColor Gray
    Write-Host "  docker compose logs -f         - Ver logs en tiempo real" -ForegroundColor Gray
    Write-Host "  docker compose logs backend    - Ver logs del backend" -ForegroundColor Gray
    Write-Host "  docker compose logs frontend   - Ver logs del frontend" -ForegroundColor Gray
    Write-Host "  docker compose stop            - Detener servicios" -ForegroundColor Gray
    Write-Host "  docker compose down            - Detener y eliminar contenedores" -ForegroundColor Gray
    Write-Host "  docker compose down -v         - Detener y eliminar todo (incluye datos)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Para detener: .\stop-docker.ps1" -ForegroundColor Yellow
    Write-Host ""
    
    # Abrir navegador
    $openBrowser = Read-Host "¿Deseas abrir el navegador? (s/n)"
    if ($openBrowser -eq "s") {
        Start-Process "http://localhost:5173"
        Start-Process "http://localhost:5000/swagger"
    }
    
    Write-Host ""
    Write-Host "¡Listo para desarrollar! 🚀" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "⚠ Los servicios tardaron más de lo esperado" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Verifica el estado con:" -ForegroundColor Cyan
    Write-Host "  docker compose ps" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ver logs:" -ForegroundColor Cyan
    Write-Host "  docker compose logs" -ForegroundColor Gray
    Write-Host ""
}
