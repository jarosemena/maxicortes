# 🔧 MaxiCortes - Guía de Solución de Problemas

## ❌ Problema: Swagger no funciona (http://localhost:5000/swagger)

### Solución Rápida

1. **Verificar estado de servicios**
   ```powershell
   .\check-docker.ps1
   ```

2. **Reconstruir el backend**
   ```powershell
   .\rebuild-backend.ps1
   ```

3. **Acceder a Swagger**
   - URL correcta: http://localhost:5000/swagger
   - O la raíz: http://localhost:5000/

### Diagnóstico Detallado

#### 1. Verificar que el contenedor esté corriendo

```bash
docker compose ps
```

Deberías ver:
```
NAME                    STATUS
maxicortes-backend      Up (healthy)
maxicortes-frontend     Up (healthy)
maxicortes-postgres     Up (healthy)
```

#### 2. Ver logs del backend

```bash
docker compose logs backend
```

Busca errores o mensajes como:
- ✅ "Now listening on: http://[::]:5000"
- ✅ "Application started"
- ❌ Errores de conexión a base de datos
- ❌ Errores de compilación

#### 3. Verificar health check

```bash
# Verificar salud
docker inspect --format='{{.State.Health.Status}}' maxicortes-backend

# Probar endpoint de salud
curl http://localhost:5000/api/health
```

#### 4. Verificar que el puerto esté escuchando

```powershell
# Windows
netstat -ano | findstr :5000
```

Deberías ver algo como:
```
TCP    0.0.0.0:5000    0.0.0.0:0    LISTENING    <PID>
```

### Causas Comunes

#### Causa 1: Backend no terminó de iniciar

**Síntoma**: Contenedor está "starting" o "unhealthy"

**Solución**:
```bash
# Esperar más tiempo
docker compose logs -f backend

# Ver si hay errores de base de datos
docker compose logs postgres
```

#### Causa 2: Error de compilación

**Síntoma**: Contenedor se detiene inmediatamente

**Solución**:
```bash
# Ver logs completos
docker compose logs backend

# Reconstruir desde cero
docker compose down
docker compose up --build -d
```

#### Causa 3: Puerto ocupado

**Síntoma**: Error "port is already allocated"

**Solución**:
```powershell
# Ver qué usa el puerto
netstat -ano | findstr :5000

# Matar el proceso
taskkill /PID <PID> /F

# Reiniciar
docker compose up -d
```

#### Causa 4: Problema con PostgreSQL

**Síntoma**: Backend muestra errores de conexión a BD

**Solución**:
```bash
# Verificar PostgreSQL
docker compose ps postgres
docker compose logs postgres

# Reiniciar en orden
docker compose restart postgres
docker compose restart backend
```

## ❌ Problema: Frontend no carga (http://localhost:5173)

### Solución Rápida

```bash
# Ver logs
docker compose logs frontend

# Reiniciar
docker compose restart frontend

# Reconstruir
docker compose up --build -d frontend
```

### Diagnóstico

```bash
# Verificar estado
docker compose ps frontend

# Ver logs en tiempo real
docker compose logs -f frontend

# Verificar que Vite esté corriendo
docker compose exec frontend ps aux | grep vite
```

## ❌ Problema: Base de datos no conecta

### Solución Rápida

```bash
# Verificar PostgreSQL
docker compose ps postgres

# Ver logs
docker compose logs postgres

# Reiniciar
docker compose restart postgres

# Probar conexión
docker compose exec postgres psql -U postgres -d maxicortes
```

### Verificar Conexión

```bash
# Desde el backend
docker compose exec backend env | grep ConnectionStrings

# Probar conexión directa
docker compose exec postgres pg_isready -U postgres
```

## ❌ Problema: Servicios no inician

### Solución: Reinicio Completo

```bash
# Detener todo
docker compose down

# Limpiar volúmenes (CUIDADO: Elimina datos)
docker compose down -v

# Reconstruir todo
docker compose up --build -d

# Ver logs
docker compose logs -f
```

## ❌ Problema: Cambios no se reflejan

### Frontend (Hot Reload)

```bash
# Verificar que el volumen esté montado
docker compose exec frontend ls -la /app/src

# Reiniciar
docker compose restart frontend
```

### Backend (Requiere Rebuild)

```bash
# Reconstruir
docker compose up --build -d backend

# O usar el script
.\rebuild-backend.ps1
```

## ❌ Problema: Error "Cannot connect to Docker daemon"

### Solución

1. Abre Docker Desktop
2. Espera a que inicie completamente
3. Verifica con: `docker ps`
4. Intenta de nuevo

## ❌ Problema: Espacio en disco

### Solución

```bash
# Ver uso de espacio
docker system df

# Limpiar imágenes no usadas
docker image prune -a

# Limpiar todo (CUIDADO)
docker system prune -a --volumes
```

## 🔍 Comandos de Diagnóstico

### Ver Todo

```bash
# Estado de todos los servicios
docker compose ps

# Logs de todos los servicios
docker compose logs

# Logs en tiempo real
docker compose logs -f

# Uso de recursos
docker stats
```

### Por Servicio

```bash
# Backend
docker compose logs backend
docker compose exec backend bash
docker compose restart backend

# Frontend
docker compose logs frontend
docker compose exec frontend sh
docker compose restart frontend

# PostgreSQL
docker compose logs postgres
docker compose exec postgres psql -U postgres -d maxicortes
docker compose restart postgres
```

### Networking

```bash
# Ver red
docker network inspect maxicortes-network

# Probar conectividad entre servicios
docker compose exec backend ping postgres
docker compose exec frontend ping backend
```

### Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen de datos
docker volume inspect maxicortes-postgres-data

# Ver tamaño
docker system df -v
```

## 🆘 Solución Nuclear (Último Recurso)

Si nada funciona, reinicia desde cero:

```bash
# 1. Detener y eliminar TODO
docker compose down -v

# 2. Limpiar Docker
docker system prune -a --volumes

# 3. Reiniciar Docker Desktop

# 4. Iniciar de nuevo
.\start-docker.ps1
```

## 📞 Obtener Ayuda

### Información para Reportar

Cuando pidas ayuda, incluye:

```bash
# 1. Estado de servicios
docker compose ps

# 2. Logs recientes
docker compose logs --tail=100

# 3. Versión de Docker
docker --version
docker compose version

# 4. Sistema operativo
# Windows, Mac, Linux

# 5. Mensaje de error específico
```

### Scripts de Diagnóstico

```powershell
# Verificación completa
.\check-docker.ps1

# Reconstruir backend
.\rebuild-backend.ps1
```

## ✅ Verificación Final

Después de solucionar, verifica:

```bash
# 1. Todos los servicios están healthy
docker compose ps

# 2. Endpoints responden
curl http://localhost:5000/api/health
curl http://localhost:5000/swagger
curl http://localhost:5173

# 3. No hay errores en logs
docker compose logs --tail=50
```

---

## 🎯 Resumen de Comandos Útiles

```bash
# Verificar estado
.\check-docker.ps1
docker compose ps

# Ver logs
docker compose logs -f
docker compose logs backend

# Reiniciar
docker compose restart backend
docker compose restart

# Reconstruir
.\rebuild-backend.ps1
docker compose up --build -d

# Limpiar y reiniciar
docker compose down -v
.\start-docker.ps1
```

**¿Aún tienes problemas?** Ejecuta `.\check-docker.ps1` y comparte la salida.
