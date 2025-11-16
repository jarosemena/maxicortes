# Script para reconstruir solo el backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Reconstruyendo Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Deteniendo backend..." -ForegroundColor Yellow
docker compose stop backend

Write-Host "Reconstruyendo backend..." -ForegroundColor Yellow
docker compose build backend

Write-Host "Iniciando backend..." -ForegroundColor Yellow
docker compose up -d backend

Write-Host ""
Write-Host "Esperando a que el backend esté listo..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Verificando estado..." -ForegroundColor Yellow
docker compose ps backend

Write-Host ""
Write-Host "Últimos logs:" -ForegroundColor Yellow
docker compose logs --tail=30 backend

Write-Host ""
Write-Host "Probando Swagger..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/swagger" -Method Get -TimeoutSec 5
    Write-Host "✓ Swagger disponible en: http://localhost:5000/swagger" -ForegroundColor Green
} catch {
    Write-Host "✗ Swagger aún no disponible" -ForegroundColor Red
    Write-Host "  Espera unos segundos más y prueba: http://localhost:5000/swagger" -ForegroundColor Yellow
}

Write-Host ""
