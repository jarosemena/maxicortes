# 🐳 MaxiCortes - Guía de Docker Compose

## 📋 Descripción

Esta configuración permite ejecutar **toda la aplicación MaxiCortes** en contenedores Docker con un solo comando:
- PostgreSQL (Base de datos)
- Backend API (.NET 8)
- Frontend (React + Vite)

## 🚀 Inicio Rápido

### Prerrequisitos

- **Docker Desktop** instalado y corriendo
  - Windows: https://www.docker.com/products/docker-desktop
  - Incluye Docker Compose automáticamente

### Iniciar Todo

```powershell
# PowerShell
.\start-docker.ps1

# O CMD
start-docker.cmd
```

**Primera vez**: Tomará 5-10 minutos (descarga imágenes y compila)  
**Siguientes veces**: 1-2 minutos (reutiliza imágenes)

### URLs de Acceso

Una vez iniciado:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger
- **PostgreSQL**: localhost:5432

## 📦 Servicios Incluidos

### 1. PostgreSQL
- **Imagen**: postgres:14-alpine
- **Puerto**: 5432
- **Usuario**: postgres
- **Password**: postgres
- **Database**: maxicortes
- **Volumen**: Datos persistentes en `maxicortes-postgres-data`

### 2. Backend API
- **Build**: Desde `backend-api/Dockerfile`
- **Puerto**: 5000
- **Framework**: .NET 8
- **Health Check**: `/api/health`
- **Logs**: Disponibles con `docker compose logs backend`

### 3. Frontend
- **Build**: Desde `frontend-web/Dockerfile.dev`
- **Puerto**: 5173
- **Framework**: React 18 + Vite
- **Hot Reload**: Activado (cambios en tiempo real)
- **Logs**: Disponibles con `docker compose logs frontend`

## 🔧 Comandos Útiles

### Ver Estado

```bash
# Ver todos los contenedores
docker compose ps

# Ver estado detallado
docker compose ps -a
```

### Ver Logs

```bash
# Todos los servicios
docker compose logs

# Logs en tiempo real
docker compose logs -f

# Solo backend
docker compose logs backend

# Solo frontend
docker compose logs frontend

# Solo PostgreSQL
docker compose logs postgres

# Últimas 100 líneas
docker compose logs --tail=100
```

### Reiniciar Servicios

```bash
# Reiniciar todo
docker compose restart

# Reiniciar solo backend
docker compose restart backend

# Reiniciar solo frontend
docker compose restart frontend
```

### Detener Servicios

```bash
# Detener (mantiene contenedores)
docker compose stop

# Iniciar de nuevo
docker compose start

# Detener y eliminar contenedores
docker compose down

# Detener y eliminar TODO (incluye datos)
docker compose down -v
```

### Reconstruir

```bash
# Reconstruir todo
docker compose up --build -d

# Reconstruir solo backend
docker compose up --build -d backend

# Reconstruir solo frontend
docker compose up --build -d frontend
```

### Ejecutar Comandos en Contenedores

```bash
# Bash en backend
docker compose exec backend bash

# Bash en frontend
docker compose exec frontend sh

# psql en PostgreSQL
docker compose exec postgres psql -U postgres -d maxicortes

# Ver variables de entorno del backend
docker compose exec backend env
```

## 🔍 Verificación de Salud

### Health Checks Automáticos

Todos los servicios tienen health checks configurados:

```bash
# Ver estado de salud
docker compose ps

# Inspeccionar salud de un servicio
docker inspect --format='{{.State.Health.Status}}' maxicortes-backend
```

Estados posibles:
- `starting`: Iniciando
- `healthy`: Saludable
- `unhealthy`: Con problemas

### Verificar Manualmente

```bash
# Backend health check
curl http://localhost:5000/api/health

# Frontend
curl http://localhost:5173

# PostgreSQL
docker compose exec postgres pg_isready -U postgres
```

## 🗄️ Gestión de Base de Datos

### Conectarse a PostgreSQL

```bash
# Desde línea de comandos
docker compose exec postgres psql -U postgres -d maxicortes

# Desde pgAdmin o DBeaver
Host: localhost
Port: 5432
Database: maxicortes
Username: postgres
Password: postgres
```

### Backup de Base de Datos

```bash
# Exportar
docker compose exec postgres pg_dump -U postgres maxicortes > backup.sql

# Importar
docker compose exec -T postgres psql -U postgres maxicortes < backup.sql
```

### Resetear Base de Datos

```bash
# Opción 1: Eliminar volumen
docker compose down -v
docker compose up -d

# Opción 2: Desde psql
docker compose exec postgres psql -U postgres -c "DROP DATABASE maxicortes;"
docker compose exec postgres psql -U postgres -c "CREATE DATABASE maxicortes;"
docker compose restart backend
```

## 🔄 Desarrollo con Hot Reload

### Frontend
- ✅ **Hot reload activado** automáticamente
- Los cambios en `frontend-web/src/` se reflejan inmediatamente
- No necesitas reconstruir el contenedor

### Backend
- ⚠️ Requiere reconstruir para ver cambios
- Opción rápida: `docker compose up --build -d backend`
- Para desarrollo activo, considera usar desarrollo local

## 📊 Monitoreo

### Ver Recursos Usados

```bash
# Uso de recursos
docker stats

# Solo contenedores de MaxiCortes
docker stats maxicortes-postgres maxicortes-backend maxicortes-frontend
```

### Ver Redes

```bash
# Listar redes
docker network ls

# Inspeccionar red de MaxiCortes
docker network inspect maxicortes-network
```

### Ver Volúmenes

```bash
# Listar volúmenes
docker volume ls

# Inspeccionar volumen de datos
docker volume inspect maxicortes-postgres-data

# Ver tamaño del volumen
docker system df -v
```

## 🐛 Solución de Problemas

### Problema 1: Servicios no inician

**Síntomas**: Contenedores se detienen inmediatamente

**Solución**:
```bash
# Ver logs de error
docker compose logs

# Ver logs específicos
docker compose logs backend
docker compose logs frontend

# Verificar configuración
docker compose config
```

### Problema 2: Puerto ya en uso

**Error**: `Bind for 0.0.0.0:5000 failed: port is already allocated`

**Solución**:
```bash
# Ver qué usa el puerto
netstat -ano | findstr :5000

# Detener proceso
taskkill /PID <PID> /F

# O cambiar puerto en docker-compose.yml
```

### Problema 3: Backend no conecta a PostgreSQL

**Síntomas**: Backend muestra errores de conexión

**Solución**:
```bash
# Verificar que PostgreSQL esté healthy
docker compose ps

# Ver logs de PostgreSQL
docker compose logs postgres

# Reiniciar servicios en orden
docker compose restart postgres
docker compose restart backend
```

### Problema 4: Frontend no carga

**Síntomas**: http://localhost:5173 no responde

**Solución**:
```bash
# Ver logs
docker compose logs frontend

# Verificar que el contenedor esté corriendo
docker compose ps frontend

# Reconstruir
docker compose up --build -d frontend
```

### Problema 5: Cambios no se reflejan

**Frontend**:
```bash
# Verificar que el volumen esté montado
docker compose exec frontend ls -la /app/src

# Reiniciar
docker compose restart frontend
```

**Backend**:
```bash
# Reconstruir
docker compose up --build -d backend
```

### Problema 6: Espacio en disco

**Síntomas**: Error de espacio en disco

**Solución**:
```bash
# Ver uso de espacio
docker system df

# Limpiar imágenes no usadas
docker image prune -a

# Limpiar todo (cuidado!)
docker system prune -a --volumes
```

## 🔐 Seguridad

### Cambiar Credenciales de PostgreSQL

Edita `docker-compose.yml`:

```yaml
postgres:
  environment:
    POSTGRES_USER: tu_usuario
    POSTGRES_PASSWORD: tu_password_seguro
    POSTGRES_DB: maxicortes

backend:
  environment:
    - ConnectionStrings__DefaultConnection=Host=postgres;Database=maxicortes;Username=tu_usuario;Password=tu_password_seguro
```

Luego:
```bash
docker compose down -v
docker compose up -d
```

## 📈 Optimización

### Reducir Tiempo de Build

```bash
# Usar cache de Docker
docker compose build --parallel

# Build sin cache (si hay problemas)
docker compose build --no-cache
```

### Reducir Uso de Recursos

Edita `docker-compose.yml` y agrega límites:

```yaml
backend:
  deploy:
    resources:
      limits:
        cpus: '1'
        memory: 1G
      reservations:
        cpus: '0.5'
        memory: 512M
```

## 🎯 Casos de Uso

### Desarrollo Local

```bash
# Iniciar todo
.\start-docker.ps1

# Desarrollar en frontend (hot reload automático)
# Edita archivos en frontend-web/src/

# Ver logs en tiempo real
docker compose logs -f frontend
```

### Testing

```bash
# Iniciar servicios
docker compose up -d

# Ejecutar tests del backend
docker compose exec backend dotnet test

# Ejecutar tests del frontend
docker compose exec frontend npm test
```

### Demostración

```bash
# Iniciar todo
.\start-docker.ps1

# Abrir navegador
start http://localhost:5173
start http://localhost:5000/swagger

# Mostrar logs en tiempo real
docker compose logs -f
```

### CI/CD

```bash
# En pipeline de CI/CD
docker compose up -d
docker compose exec backend dotnet test
docker compose exec frontend npm test
docker compose down
```

## 📝 Archivos Importantes

```
maxicortes/
├── docker-compose.yml              # Configuración principal
├── start-docker.ps1                # Script de inicio (PowerShell)
├── start-docker.cmd                # Script de inicio (CMD)
├── stop-docker.ps1                 # Script para detener (PowerShell)
├── stop-docker.cmd                 # Script para detener (CMD)
├── backend-api/
│   ├── Dockerfile                  # Dockerfile del backend
│   └── .dockerignore              # Archivos a ignorar
└── frontend-web/
    ├── Dockerfile.dev              # Dockerfile de desarrollo
    ├── Dockerfile                  # Dockerfile de producción
    └── .dockerignore              # Archivos a ignorar
```

## 🎓 Recursos Adicionales

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [.NET Docker Images](https://hub.docker.com/_/microsoft-dotnet)
- [Node.js Docker Images](https://hub.docker.com/_/node)
- [PostgreSQL Docker Images](https://hub.docker.com/_/postgres)

## ✅ Checklist de Verificación

Después de iniciar:

- [ ] `docker compose ps` muestra 3 contenedores corriendo
- [ ] Todos los contenedores están "healthy"
- [ ] http://localhost:5173 carga el frontend
- [ ] http://localhost:5000/swagger muestra la API
- [ ] http://localhost:5000/api/health responde "Healthy"
- [ ] Los logs no muestran errores críticos

## 🎉 Ventajas de Docker Compose

1. **Un solo comando** - Inicia todo el stack
2. **Aislamiento** - No afecta tu sistema
3. **Consistencia** - Mismo entorno para todos
4. **Portabilidad** - Funciona en cualquier OS con Docker
5. **Fácil de limpiar** - `docker compose down -v`
6. **Networking automático** - Los servicios se comunican entre sí
7. **Health checks** - Monitoreo automático
8. **Logs centralizados** - `docker compose logs`

---

**¡Listo para desarrollar con Docker! 🚀**
