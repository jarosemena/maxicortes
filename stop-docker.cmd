@echo off
REM MaxiCortes - Script para detener Docker Compose

echo ========================================
echo   MaxiCortes - Detener Servicios
echo ========================================
echo.

echo Opciones:
echo 1. Detener servicios (mantener datos)
echo 2. Detener y eliminar contenedores (mantener datos)
echo 3. Detener y eliminar todo (incluye base de datos)
echo.

set /p OPTION="Selecciona una opcion (1-3): "

if "%OPTION%"=="1" (
    echo.
    echo Deteniendo servicios...
    docker compose stop
    echo OK: Servicios detenidos
    echo.
    echo Para reiniciar: docker compose start
) else if "%OPTION%"=="2" (
    echo.
    echo Deteniendo y eliminando contenedores...
    docker compose down
    echo OK: Contenedores eliminados
    echo.
    echo Los datos de PostgreSQL se mantienen en el volumen
    echo Para reiniciar: start-docker.cmd
) else if "%OPTION%"=="3" (
    echo.
    echo ADVERTENCIA: Esto eliminara todos los datos de la base de datos
    set /p CONFIRM="Estas seguro? (s/n): "
    
    if /i "%CONFIRM%"=="s" (
        echo.
        echo Deteniendo y eliminando todo...
        docker compose down -v
        echo OK: Todo eliminado (contenedores, redes y volumenes)
        echo.
        echo Para reiniciar desde cero: start-docker.cmd
    ) else (
        echo Operacion cancelada
    )
) else (
    echo Opcion invalida
)

echo.
pause
