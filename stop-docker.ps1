# MaxiCortes - Script para detener Docker Compose

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MaxiCortes - Detener Servicios" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Opciones:" -ForegroundColor Yellow
Write-Host "1. Detener servicios (mantener datos)" -ForegroundColor Gray
Write-Host "2. Detener y eliminar contenedores (mantener datos)" -ForegroundColor Gray
Write-Host "3. Detener y eliminar todo (incluye base de datos)" -ForegroundColor Gray
Write-Host ""

$option = Read-Host "Selecciona una opción (1-3)"

switch ($option) {
    "1" {
        Write-Host ""
        Write-Host "Deteniendo servicios..." -ForegroundColor Yellow
        docker compose stop
        Write-Host "✓ Servicios detenidos" -ForegroundColor Green
        Write-Host ""
        Write-Host "Para reiniciar: docker compose start" -ForegroundColor Cyan
    }
    "2" {
        Write-Host ""
        Write-Host "Deteniendo y eliminando contenedores..." -ForegroundColor Yellow
        docker compose down
        Write-Host "✓ Contenedores eliminados" -ForegroundColor Green
        Write-Host ""
        Write-Host "Los datos de PostgreSQL se mantienen en el volumen" -ForegroundColor Cyan
        Write-Host "Para reiniciar: .\start-docker.ps1" -ForegroundColor Cyan
    }
    "3" {
        Write-Host ""
        Write-Host "⚠ ADVERTENCIA: Esto eliminará todos los datos de la base de datos" -ForegroundColor Red
        $confirm = Read-Host "¿Estás seguro? (s/n)"
        
        if ($confirm -eq "s") {
            Write-Host ""
            Write-Host "Deteniendo y eliminando todo..." -ForegroundColor Yellow
            docker compose down -v
            Write-Host "✓ Todo eliminado (contenedores, redes y volúmenes)" -ForegroundColor Green
            Write-Host ""
            Write-Host "Para reiniciar desde cero: .\start-docker.ps1" -ForegroundColor Cyan
        } else {
            Write-Host "Operación cancelada" -ForegroundColor Yellow
        }
    }
    default {
        Write-Host "Opción inválida" -ForegroundColor Red
    }
}

Write-Host ""
