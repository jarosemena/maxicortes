@echo off
REM Script de diagnostico rapido

echo ========================================
echo   Diagnostico de MaxiCortes
echo ========================================
echo.

echo 1. Estado de contenedores:
echo ----------------------------------------
docker compose ps
echo.

echo 2. Salud de contenedores:
echo ----------------------------------------
docker inspect --format="PostgreSQL: {{.State.Health.Status}}" maxicortes-postgres 2>nul
docker inspect --format="Backend: {{.State.Health.Status}}" maxicortes-backend 2>nul
docker inspect --format="Frontend: {{.State.Health.Status}}" maxicortes-frontend 2>nul
echo.

echo 3. Ultimos logs del Backend:
echo ----------------------------------------
docker compose logs --tail=50 backend
echo.

echo 4. Ultimos logs de PostgreSQL:
echo ----------------------------------------
docker compose logs --tail=20 postgres
echo.

echo 5. Puertos en uso:
echo ----------------------------------------
netstat -ano | findstr :5000
netstat -ano | findstr :5173
netstat -ano | findstr :5432
echo.

echo ========================================
echo   Comandos utiles:
echo ========================================
echo   docker compose logs backend -f
echo   docker compose restart backend
echo   docker compose up --build -d backend
echo.
pause
