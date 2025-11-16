# MaxiCortes - Sistema de Optimización de Cortes

Sistema completo para optimización de cortes de materiales con backend en .NET 8, frontend en React 18 y motor de optimización en Python.

## 🚀 Inicio Rápido

### Prerrequisitos

- **Docker Desktop** instalado y corriendo
  - Descarga: https://www.docker.com/products/docker-desktop

### Iniciar con Docker Compose ⭐

Todo en contenedores con un solo comando:

```powershell
# PowerShell
.\start-docker.ps1

# CMD
start-docker.cmd
```

Inicia automáticamente:
- ✅ PostgreSQL en contenedor
- ✅ Backend API en contenedor
- ✅ Frontend en contenedor
- ✅ Networking entre servicios
- ✅ Health checks automáticos

**Primera vez**: 5-10 minutos (descarga y compila)  
**Siguientes veces**: 1-2 minutos

### URLs de Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger

## 📁 Estructura del Proyecto

```
maxicortes/
├── backend-api/          # Backend .NET 8 Web API
│   ├── src/
│   │   ├── MaxiCortes.Domain/
│   │   ├── MaxiCortes.Application/
│   │   ├── MaxiCortes.Infrastructure/
│   │   └── MaxiCortes.WebAPI/
│   └── tests/
├── frontend-web/         # Frontend React 18 + TypeScript
│   ├── src/
│   │   ├── domain/
│   │   ├── application/
│   │   ├── infrastructure/
│   │   └── presentation/
│   └── tests/
├── optimization-engine/  # Motor de optimización Python
│   └── src/
├── docker-compose.yml   # Configuración Docker Compose
├── start-docker.ps1     # Script de inicio (PowerShell)
├── start-docker.cmd     # Script de inicio (CMD)
├── stop-docker.ps1      # Script para detener
└── stop-docker.cmd      # Script para detener (CMD)
```

## 🛠️ Scripts Disponibles

### Docker Compose

```powershell
# Iniciar todos los servicios
.\start-docker.ps1

# Detener servicios
.\stop-docker.ps1

# Ver estado
docker compose ps

# Ver logs
docker compose logs -f
```

### Backend

```bash
cd backend-api/src/MaxiCortes.WebAPI
dotnet run                    # Iniciar servidor
dotnet test                   # Ejecutar tests
dotnet build                  # Compilar
```

### Frontend

```bash
cd frontend-web
npm run dev                   # Servidor de desarrollo
npm test                      # Ejecutar tests
npm run build                 # Build de producción
npm run lint                  # Linting
```

## 🗄️ Configuración de Base de Datos

### Configuración por Defecto

```
Host: localhost
Database: maxicortes
Username: postgres
Password: postgres
Port: 5432
```

### Cambiar Configuración

Edita `backend-api/src/MaxiCortes.WebAPI/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=maxicortes;Username=postgres;Password=postgres"
  }
}
```

O usa el script interactivo `start-dev.ps1` que te preguntará por la configuración.

## 📚 Documentación

- **[DOCKER_COMPOSE_GUIDE.md](DOCKER_COMPOSE_GUIDE.md)** - Guía completa de Docker Compose
- **[DOCKER_COMPOSE_SUMMARY.md](DOCKER_COMPOSE_SUMMARY.md)** - Resumen de implementación
- **[backend-api/TASKS.md](backend-api/TASKS.md)** - Plan de desarrollo del backend
- **[frontend-web/TASKS.md](frontend-web/TASKS.md)** - Plan de desarrollo del frontend
- **Swagger UI**: http://localhost:5000/swagger (cuando esté corriendo)

## 🏗️ Arquitectura

### Backend (.NET 8)
- **Arquitectura Hexagonal** (Clean Architecture)
- **Entity Framework Core** con PostgreSQL
- **AutoMapper** para DTOs
- **Serilog** para logging estructurado
- **Swagger/OpenAPI** para documentación
- **137 tests** con 100% de cobertura

### Frontend (React 18)
- **Arquitectura Hexagonal**
- **TypeScript** estricto
- **Material-UI** para componentes
- **React Query** para estado del servidor
- **Zustand** para estado global
- **Vitest** para testing
- **182+ tests** implementados

### Motor de Optimización (Python)
- Algoritmos de optimización de cortes
- API REST con FastAPI
- Integración con backend .NET

## 🧪 Testing

### Backend
```bash
cd backend-api
dotnet test
# 137 tests - 100% pasando
```

### Frontend
```bash
cd frontend-web
npm test
# 182+ tests implementados
```

## 🐛 Solución de Problemas

### Puerto ya en uso

```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :5000

# Matar el proceso
taskkill /PID <PID> /F
```

### PostgreSQL no conecta

```powershell
# Verificar servicio
Get-Service -Name postgresql*

# Iniciar servicio
Start-Service postgresql-x64-14
```

### Más ayuda

Consulta [DEV_SETUP.md](DEV_SETUP.md) para solución de problemas detallada.

## 📊 Estado del Proyecto

### Backend API ✅
- ✅ Clean Architecture implementada
- ✅ 137 tests pasando (100%)
- ✅ API REST completa
- ✅ Swagger documentado
- ✅ Logs estructurados
- ✅ Health checks

### Frontend Web ✅
- ✅ Arquitectura Hexagonal
- ✅ 182+ tests implementados
- ✅ Componentes UI completos
- ✅ Gestión de materiales (CRUD)
- ✅ Integración con API
- ✅ React Query + Zustand

### Próximas Funcionalidades
- 🔄 Gestión de órdenes multi-material
- 🔄 Visualización 2D con Konva.js
- 🔄 Integración con motor de optimización
- 🔄 Upload de archivos CSV/Excel

## 🤝 Contribución

1. Crea una rama desde `develop`
2. Implementa tu funcionalidad con TDD
3. Asegura cobertura ≥90%
4. Crea un Pull Request

## 📄 Licencia

Este proyecto es privado y confidencial.

---

## 🆘 Soporte

Para problemas o preguntas:

1. Revisa [DEV_SETUP.md](DEV_SETUP.md)
2. Verifica los logs en `backend-api/src/MaxiCortes.WebAPI/logs/`
3. Abre un issue en GitHub
4. Contacta al equipo de desarrollo

---

**MaxiCortes** - Optimización de cortes de materiales
