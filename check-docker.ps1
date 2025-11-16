# Script para verificar el estado de Docker Compose

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Verificación de Servicios Docker" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar estado de contenedores
Write-Host "Estado de contenedores:" -ForegroundColor Yellow
docker compose ps
Write-Host ""

# Verificar salud de contenedores
Write-Host "Salud de contenedores:" -ForegroundColor Yellow
$postgres = docker inspect --format='{{.State.Health.Status}}' maxicortes-postgres 2>$null
$backend = docker inspect --format='{{.State.Health.Status}}' maxicortes-backend 2>$null
$frontend = docker inspect --format='{{.State.Health.Status}}' maxicortes-frontend 2>$null

Write-Host "PostgreSQL: $postgres" -ForegroundColor $(if ($postgres -eq "healthy") { "Green" } else { "Red" })
Write-Host "Backend:    $backend" -ForegroundColor $(if ($backend -eq "healthy") { "Green" } else { "Red" })
Write-Host "Frontend:   $frontend" -ForegroundColor $(if ($frontend -eq "healthy") { "Green" } else { "Red" })
Write-Host ""

# Ver últimas líneas de logs del backend
Write-Host "Últimos logs del Backend:" -ForegroundColor Yellow
docker compose logs --tail=50 backend
Write-Host ""

# Probar endpoints
Write-Host "Probando endpoints:" -ForegroundColor Yellow

try {
    $health = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Health Check: OK ($($health.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ Health Check: FALLO" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

try {
    $swagger = Invoke-WebRequest -Uri "http://localhost:5000/swagger" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Swagger UI: OK ($($swagger.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ Swagger UI: FALLO" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✓ Frontend: OK ($($frontend.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "✗ Frontend: FALLO" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "Comandos útiles:" -ForegroundColor Cyan
Write-Host "  docker compose logs backend -f    - Ver logs del backend en tiempo real" -ForegroundColor Gray
Write-Host "  docker compose restart backend    - Reiniciar backend" -ForegroundColor Gray
Write-Host "  docker compose exec backend bash  - Entrar al contenedor" -ForegroundColor Gray
Write-Host ""
