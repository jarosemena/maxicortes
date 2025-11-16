# 🚀 MaxiCortes - Guía de Configuración con Docker Compose

Esta guía te ayudará a configurar y ejecutar MaxiCortes usando Docker Compose.

## 📋 Prerrequisitos

### Software Requerido

1. **Docker Desktop**
   - Windows: https://www.docker.com/products/docker-desktop
   - Incluye Docker y Docker Compose
   - Verifica instalación: `docker --version` y `docker compose version`

### Herramientas Opcionales (Recomendadas)

- **Visual Studio Code**: Editor de código
- **Postman**: Para probar APIs
- **pgAdmin 4** o **DBeaver**: Para conectarse a PostgreSQL en Docker

## 🗄️ Configuración de Base de Datos

### Opción 1: Usar configuración por defecto

La aplicación viene configurada con estos valores por defecto:

```
Host: localhost
Database: maxicortes
Username: postgres
Password: postgres
Port: 5432
```

### Opción 2: Crear base de datos manualmente

1. Abre pgAdmin o psql
2. Crea la base de datos:

```sql
CREATE DATABASE maxicortes;
```

3. La aplicación creará las tablas automáticamente al iniciar

### Opción 3: Usar tu propia configuración

Si tu PostgreSQL tiene credenciales diferentes:

1. Edita `backend-api/src/MaxiCortes.WebAPI/appsettings.Development.json`
2. Actualiza la cadena de conexión:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=TU_HOST;Database=TU_DB;Username=TU_USER;Password=TU_PASSWORD"
  }
}
```

O usa el script interactivo que te preguntará por la configuración.

## 🚀 Inicio Rápido

### Con Docker Compose (Recomendado)

1. Asegúrate de que Docker Desktop esté corriendo
2. Abre PowerShell o CMD
3. Navega al directorio del proyecto
4. Ejecuta:

```powershell
# PowerShell
.\start-docker.ps1

# O CMD
start-docker.cmd
```

El script:
- ✅ Verifica Docker y Docker Compose
- ✅ Inicia PostgreSQL en contenedor
- ✅ Compila e inicia Backend en contenedor
- ✅ Compila e inicia Frontend en contenedor
- ✅ Espera a que todos estén saludables
- ✅ Muestra URLs de acceso

**Primera vez**: 5-10 minutos (descarga imágenes y compila)  
**Siguientes veces**: 1-2 minutos (reutiliza imágenes)

## 🌐 URLs de Acceso

Una vez iniciados los servicios:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Swagger UI**: http://localhost:5000/swagger
- **Health Check**: http://localhost:5000/api/health

## 🛠️ Comandos Útiles

### Backend

```bash
# Restaurar paquetes
dotnet restore

# Compilar
dotnet build

# Ejecutar tests
dotnet test

# Ejecutar con hot reload
dotnet watch run

# Crear migración (si usas EF Migrations)
dotnet ef migrations add NombreMigracion

# Aplicar migraciones
dotnet ef database update
```

### Frontend

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview

# Tests
npm test

# Tests con cobertura
npm run test:coverage

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🔧 Configuración Avanzada

### Variables de Entorno - Backend

Edita `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=maxicortes;Username=postgres;Password=postgres"
  },
  "OptimizationService": {
    "UseRealService": false,
    "BaseUrl": "http://localhost:8000",
    "TimeoutSeconds": 300
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  }
}
```

### Variables de Entorno - Frontend

Edita `frontend-web/.env.development`:

```bash
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_DEVTOOLS=true
VITE_ENABLE_MOCK_DATA=false

# File Upload
VITE_MAX_FILE_SIZE=10485760
VITE_ALLOWED_FILE_TYPES=.csv,.xlsx,.xls
```

### Cambiar Puertos

#### Backend (Puerto 5000)

Edita `backend-api/src/MaxiCortes.WebAPI/Properties/launchSettings.json`:

```json
{
  "profiles": {
    "http": {
      "applicationUrl": "http://localhost:TU_PUERTO"
    }
  }
}
```

O usa: `dotnet run --urls=http://localhost:TU_PUERTO`

#### Frontend (Puerto 5173)

Edita `frontend-web/vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: TU_PUERTO
  }
})
```

## 🐛 Solución de Problemas

### Error: Puerto ya en uso

**Backend (5000)**:
```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :5000

# Matar el proceso (reemplaza PID)
taskkill /PID <PID> /F
```

**Frontend (5173)**:
```powershell
# Ver qué proceso usa el puerto
netstat -ano | findstr :5173

# Matar el proceso
taskkill /PID <PID> /F
```

### Error: PostgreSQL no conecta

1. Verifica que PostgreSQL esté corriendo:
   ```powershell
   Get-Service -Name postgresql*
   ```

2. Verifica el puerto:
   ```powershell
   netstat -ano | findstr :5432
   ```

3. Prueba la conexión:
   ```bash
   psql -h localhost -U postgres -d maxicortes
   ```

### Error: Base de datos no existe

El backend crea las tablas automáticamente, pero la base de datos debe existir:

```sql
-- Conecta a PostgreSQL
psql -U postgres

-- Crea la base de datos
CREATE DATABASE maxicortes;

-- Verifica
\l
```

### Error: Dependencias de npm

```bash
# Limpia cache y reinstala
cd frontend-web
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Error: Certificados SSL en desarrollo

Si tienes problemas con HTTPS:

```bash
# Backend - Usa HTTP en desarrollo
dotnet run --urls=http://localhost:5000

# Frontend - Actualiza .env.development
VITE_API_URL=http://localhost:5000
```

## 📊 Verificar que Todo Funciona

### 1. Health Check del Backend

```bash
curl http://localhost:5000/api/health
```

Respuesta esperada:
```json
{
  "status": "Healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 2. Swagger UI

Abre: http://localhost:5000/swagger

Deberías ver la documentación de la API con todos los endpoints.

### 3. Frontend

Abre: http://localhost:5173

Deberías ver la página principal de MaxiCortes.

### 4. Integración Frontend-Backend

1. Ve a Materials en el frontend
2. Intenta crear un material
3. Verifica en Swagger que el material se creó
4. Verifica en la base de datos:

```sql
SELECT * FROM "Materials";
```

## 🔄 Detener los Servicios

### Usando Script (PowerShell)

```powershell
.\stop-dev.ps1
```

### Manual

- Presiona `Ctrl+C` en cada terminal
- O cierra las ventanas de PowerShell/CMD

## 📝 Datos de Prueba

El frontend incluye datos de ejemplo (seed data) que se cargan automáticamente.

Para agregar más datos de prueba, puedes:

1. Usar Swagger UI para crear materiales
2. Usar scripts SQL en la base de datos
3. Modificar `frontend-web/src/infrastructure/data/seedMaterials.ts`

## 🎯 Próximos Pasos

Una vez que todo esté funcionando:

1. ✅ Explora la API en Swagger
2. ✅ Prueba crear materiales en el frontend
3. ✅ Revisa los logs en `backend-api/src/MaxiCortes.WebAPI/logs/`
4. ✅ Ejecuta los tests: `npm test` y `dotnet test`
5. ✅ Lee la documentación en `/docs`

## 🆘 Soporte

Si tienes problemas:

1. Revisa esta guía completa
2. Verifica los logs del backend
3. Abre las DevTools del navegador (F12)
4. Revisa los issues en GitHub
5. Contacta al equipo de desarrollo

## 📚 Recursos Adicionales

- [Documentación de .NET](https://docs.microsoft.com/dotnet/)
- [Documentación de React](https://react.dev/)
- [Documentación de PostgreSQL](https://www.postgresql.org/docs/)
- [Documentación de Vite](https://vitejs.dev/)
- [Material-UI](https://mui.com/)

---

**¡Listo para desarrollar! 🚀**
