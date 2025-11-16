# ✅ Docker Compose - Implementación Completa

## 🎉 Resumen

Se ha implementado una solución completa de Docker Compose que permite ejecutar **toda la aplicación MaxiCortes** (PostgreSQL + Backend + Frontend) en contenedores con un solo comando.

## 📦 Archivos Creados

### Docker Configuration

1. **`docker-compose.yml`** ⭐
   - Configuración principal de servicios
   - PostgreSQL + Backend + Frontend
   - Networking y volúmenes configurados
   - Health checks para todos los servicios

2. **`backend-api/Dockerfile`**
   - Multi-stage build para .NET 8
   - Optimizado para producción
   - Health check integrado

3. **`frontend-web/Dockerfile.dev`**
   - Dockerfile de desarrollo con hot reload
   - Basado en Node 18 Alpine
   - Vite dev server configurado

4. **`backend-api/.dockerignore`**
   - Excluye archivos innecesarios del build

5. **`frontend-web/.dockerignore`**
   - Excluye node_modules y archivos de build

### Scripts de Inicio/Detención

6. **`start-docker.ps1`** (PowerShell)
   - Verifica Docker y Docker Compose
   - Inicia todos los servicios
   - Espera a que estén saludables
   - Muestra URLs de acceso
   - Opción de abrir navegador

7. **`start-docker.cmd`** (CMD)
   - Versión para Command Prompt
   - Misma funcionalidad que PowerShell

8. **`stop-docker.ps1`** (PowerShell)
   - 3 opciones de detención:
     1. Solo detener (mantener todo)
     2. Detener y eliminar contenedores
     3. Eliminar todo (incluye datos)

9. **`stop-docker.cmd`** (CMD)
   - Versión para Command Prompt

### Documentación

10. **`DOCKER_COMPOSE_GUIDE.md`**
    - Guía completa de uso
    - Comandos útiles
    - Solución de problemas
    - Casos de uso
    - Best practices

11. **`README.md`** (Actualizado)
    - Incluye opción de Docker Compose
    - 3 opciones de inicio documentadas

## 🚀 Cómo Usar

### Inicio Rápido

```powershell
# 1. Asegúrate de tener Docker Desktop corriendo

# 2. Ejecuta el script
.\start-docker.ps1

# 3. Espera 1-2 minutos (primera vez: 5-10 min)

# 4. Accede a:
#    - Frontend: http://localhost:5173
#    - Backend: http://localhost:5000
#    - Swagger: http://localhost:5000/swagger
```

### Detener

```powershell
.\stop-docker.ps1
```

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────┐
│         Docker Compose Stack            │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────┐  ┌──────────────┐   │
│  │  Frontend    │  │   Backend    │   │
│  │  React+Vite  │  │   .NET 8     │   │
│  │  Port: 5173  │  │  Port: 5000  │   │
│  └──────┬───────┘  └──────┬───────┘   │
│         │                  │            │
│         └──────────┬───────┘            │
│                    │                    │
│         ┌──────────▼───────┐           │
│         │   PostgreSQL     │           │
│         │   Port: 5432     │           │
│         └──────────────────┘           │
│                                         │
│  Network: maxicortes-network           │
│  Volume: maxicortes-postgres-data      │
└─────────────────────────────────────────┘
```

## 📊 Servicios Configurados

### 1. PostgreSQL
- **Imagen**: postgres:14-alpine
- **Puerto**: 5432
- **Credenciales**:
  - Usuario: postgres
  - Password: postgres
  - Database: maxicortes
- **Volumen**: Datos persistentes
- **Health Check**: `pg_isready`

### 2. Backend API
- **Build**: Multi-stage .NET 8
- **Puerto**: 5000
- **Variables de entorno**:
  - Connection string a PostgreSQL
  - ASPNETCORE_ENVIRONMENT=Development
- **Health Check**: `/api/health`
- **Depends on**: PostgreSQL (espera a que esté healthy)

### 3. Frontend
- **Build**: Node 18 Alpine + Vite
- **Puerto**: 5173
- **Variables de entorno**:
  - VITE_API_URL=http://localhost:5000
- **Hot Reload**: Activado
- **Volumen**: Código fuente montado
- **Health Check**: HTTP check
- **Depends on**: Backend (espera a que esté healthy)

## 🎯 Ventajas

### Para Desarrollo

1. **Setup en 1 comando**
   - No necesitas instalar PostgreSQL
   - No necesitas configurar nada
   - Todo funciona out-of-the-box

2. **Aislamiento completo**
   - No afecta tu sistema
   - No conflictos con otras instalaciones
   - Fácil de limpiar

3. **Consistencia**
   - Mismo entorno para todo el equipo
   - Versiones específicas garantizadas
   - Sin "funciona en mi máquina"

4. **Hot Reload**
   - Frontend: Cambios instantáneos
   - Backend: Reconstrucción rápida

### Para Testing

1. **Entorno limpio**
   - Cada test puede empezar desde cero
   - `docker compose down -v` resetea todo

2. **CI/CD Ready**
   - Mismo docker-compose en CI/CD
   - Tests reproducibles

3. **Fácil de compartir**
   - Comparte el docker-compose.yml
   - Cualquiera puede ejecutar tests

### Para Demos

1. **Inicio rápido**
   - Un comando y listo
   - No necesitas explicar setup

2. **Confiable**
   - Siempre funciona igual
   - Health checks garantizan que esté listo

## 🔧 Comandos Útiles

### Gestión Básica

```bash
# Iniciar
docker compose up -d

# Detener
docker compose stop

# Ver estado
docker compose ps

# Ver logs
docker compose logs -f

# Reiniciar
docker compose restart

# Eliminar todo
docker compose down -v
```

### Desarrollo

```bash
# Reconstruir backend
docker compose up --build -d backend

# Ver logs del backend
docker compose logs -f backend

# Ejecutar comando en backend
docker compose exec backend dotnet --version

# Acceder a PostgreSQL
docker compose exec postgres psql -U postgres -d maxicortes
```

### Debugging

```bash
# Ver configuración
docker compose config

# Ver recursos usados
docker stats

# Inspeccionar red
docker network inspect maxicortes-network

# Ver volúmenes
docker volume ls
```

## 🐛 Solución de Problemas

### Problema: Servicios no inician

```bash
# Ver logs
docker compose logs

# Verificar Docker Desktop está corriendo
docker ps

# Reconstruir desde cero
docker compose down -v
docker compose up --build -d
```

### Problema: Puerto ocupado

```bash
# Ver qué usa el puerto
netstat -ano | findstr :5000

# Cambiar puerto en docker-compose.yml
ports:
  - "5001:5000"  # Usa 5001 en lugar de 5000
```

### Problema: Cambios no se reflejan

**Frontend**:
```bash
# Verificar volumen montado
docker compose exec frontend ls -la /app/src

# Reiniciar
docker compose restart frontend
```

**Backend**:
```bash
# Reconstruir
docker compose up --build -d backend
```

## 📈 Comparación de Opciones

| Característica | Docker Compose | Docker + Local | Todo Local |
|----------------|----------------|----------------|------------|
| Setup | 1 comando | 2 comandos | Manual |
| PostgreSQL | Contenedor | Contenedor | Instalado |
| Backend | Contenedor | Local | Local |
| Frontend | Contenedor | Local | Local |
| Hot Reload | Frontend sí | Ambos sí | Ambos sí |
| Aislamiento | Total | Parcial | Ninguno |
| Portabilidad | Alta | Media | Baja |
| Velocidad | Media | Alta | Alta |
| Recomendado para | Testing/Demos | Desarrollo | Producción local |

## 🎓 Próximos Pasos

### Para Empezar

1. ✅ Instala Docker Desktop
2. ✅ Ejecuta `.\start-docker.ps1`
3. ✅ Abre http://localhost:5173
4. ✅ ¡Empieza a desarrollar!

### Para Aprender Más

- Lee `DOCKER_COMPOSE_GUIDE.md` para comandos avanzados
- Experimenta con `docker compose logs`
- Prueba modificar el frontend (hot reload)
- Explora la base de datos con pgAdmin

### Para Producción

- Usa `frontend-web/Dockerfile` (producción)
- Configura variables de entorno seguras
- Implementa secrets management
- Configura reverse proxy (nginx)

## ✨ Características Destacadas

1. **Health Checks Automáticos**
   - Todos los servicios monitoreados
   - Reinicio automático si fallan
   - Dependencias respetadas

2. **Networking Inteligente**
   - Red privada para los servicios
   - DNS automático (backend puede acceder a postgres por nombre)
   - Aislamiento de red

3. **Volúmenes Persistentes**
   - Datos de PostgreSQL persisten
   - Código fuente montado para hot reload
   - node_modules en volumen anónimo (performance)

4. **Optimización de Build**
   - Multi-stage builds
   - Cache de capas
   - .dockerignore para builds rápidos

## 📝 Notas Importantes

### Primera Ejecución

- Tomará 5-10 minutos
- Docker descarga imágenes base
- Compila backend y frontend
- Siguientes ejecuciones: 1-2 minutos

### Datos Persistentes

- PostgreSQL usa volumen nombrado
- Datos persisten entre reinicios
- `docker compose down` NO elimina datos
- `docker compose down -v` SÍ elimina datos

### Hot Reload

- **Frontend**: Funciona automáticamente
- **Backend**: Requiere reconstruir contenedor
- Para desarrollo activo del backend, considera desarrollo local

## 🎉 Conclusión

Ahora tienes una solución completa de Docker Compose que:

✅ Inicia todo con un comando  
✅ Funciona consistentemente en cualquier máquina  
✅ Es fácil de limpiar y resetear  
✅ Está lista para desarrollo, testing y demos  
✅ Incluye documentación completa  

**¡Listo para desarrollar! 🚀**

---

**Comandos Rápidos:**

```bash
# Iniciar
.\start-docker.ps1

# Ver logs
docker compose logs -f

# Detener
.\stop-docker.ps1

# Ayuda
cat DOCKER_COMPOSE_GUIDE.md
```
