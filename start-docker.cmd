@echo off
REM MaxiCortes - Script para iniciar con Docker Compose

echo ========================================
echo   MaxiCortes - Docker Compose
echo ========================================
echo.

REM Verificar Docker
echo Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker no encontrado
    echo.
    echo Por favor instala Docker Desktop:
    echo https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo OK: Docker encontrado
echo.

REM Verificar Docker Compose
docker compose version >nul 2>&1
if errorlevel 1 (
    echo Error: Docker Compose no encontrado
    echo.
    echo Docker Compose viene incluido con Docker Desktop
    echo Asegurate de tener Docker Desktop actualizado
    pause
    exit /b 1
)
echo OK: Docker Compose encontrado
echo.

echo ========================================
echo   Iniciando Servicios
echo ========================================
echo.

echo Esto puede tomar varios minutos la primera vez...
echo Docker necesita descargar las imagenes y compilar los contenedores
echo.

REM Iniciar servicios
echo Ejecutando: docker compose up --build -d
echo.

docker compose up --build -d

if errorlevel 1 (
    echo.
    echo Error iniciando los servicios
    echo.
    echo Comandos utiles para diagnosticar:
    echo   docker compose logs           - Ver todos los logs
    echo   docker compose logs backend   - Ver logs del backend
    echo   docker compose logs frontend  - Ver logs del frontend
    echo   docker compose ps             - Ver estado de contenedores
    echo.
    pause
    exit /b 1
)

echo.
echo Esperando a que los servicios esten listos...
echo Esto puede tomar 1-2 minutos...
echo.

REM Esperar 60 segundos para que los servicios inicien
timeout /t 60 /nobreak >nul

echo.
echo ========================================
echo   Servicios Listos!
echo ========================================
echo.
echo PostgreSQL:  localhost:5432
echo Backend API: http://localhost:5000
echo Swagger UI:  http://localhost:5000/swagger
echo Frontend:    http://localhost:5173
echo.
echo Comandos utiles:
echo   docker compose ps              - Ver estado
echo   docker compose logs -f         - Ver logs en tiempo real
echo   docker compose logs backend    - Ver logs del backend
echo   docker compose logs frontend   - Ver logs del frontend
echo   docker compose stop            - Detener servicios
echo   docker compose down            - Detener y eliminar contenedores
echo   docker compose down -v         - Detener y eliminar todo (incluye datos)
echo.
echo Para detener: stop-docker.cmd
echo.

REM Abrir navegador
set /p OPEN_BROWSER="Deseas abrir el navegador? (s/n): "
if /i "%OPEN_BROWSER%"=="s" (
    start http://localhost:5173
    start http://localhost:5000/swagger
)

echo.
echo Listo para desarrollar! 🚀
echo.
pause
