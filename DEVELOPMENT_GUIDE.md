# GUÍA DE DESARROLLO - MAXICORTES

## INICIO RÁPIDO

### Prerrequisitos
- Docker y Docker Compose
- Git
- Node.js 18+ (para desarrollo frontend)
- .NET 8 SDK (para desarrollo backend)
- Python 3.11+ (para desarrollo optimization engine)

### Setup Inicial
```bash
# Clonar repositorio
git clone <repository-url>
cd maxicortes

# Levantar servicios de infraestructura
docker-compose up -d postgres redis

# Esperar a que los servicios estén listos
docker-compose logs -f postgres redis
```

---

## DESARROLLO POR APLICACIÓN

### 1. Backend API (.NET Core)

```bash
# Navegar a la carpeta
cd backend-api

# Restaurar dependencias
dotnet restore

# Ejecutar migraciones
dotnet ef database update

# Ejecutar en modo desarrollo
dotnet run --project src/MaxiCortes.WebAPI

# Ejecutar tests
dotnet test

# Ver documentación API
# http://localhost:5000/swagger
```

**Estructura de desarrollo:**
```
backend-api/
├── src/
│   ├── MaxiCortes.Domain/          # Lógica de negocio
│   ├── MaxiCortes.Application/     # Casos de uso
│   ├── MaxiCortes.Infrastructure/  # Datos y servicios externos
│   └── MaxiCortes.WebAPI/         # Controllers y middleware
└── tests/                         # Tests por capa
```

**Comandos útiles:**
```bash
# Crear nueva migración
dotnet ef migrations add NombreMigracion

# Generar cliente OpenAPI
dotnet swagger tofile --output swagger.json

# Ejecutar con hot reload
dotnet watch run
```

### 2. Optimization Engine (Python)

```bash
# Navegar a la carpeta
cd optimization-engine

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar en modo desarrollo
uvicorn src.main:app --reload --host 0.0.0.0 --port 8000

# Ejecutar tests
pytest

# Ver documentación API
# http://localhost:8000/docs
```

**Estructura de desarrollo:**
```
optimization-engine/
├── src/
│   ├── domain/                    # Entidades y lógica de dominio
│   ├── application/               # Casos de uso
│   ├── infrastructure/            # Algoritmos y persistencia
│   └── presentation/              # FastAPI endpoints
└── tests/                         # Tests por capa
```

**Comandos útiles:**
```bash
# Linting y formateo
flake8 .
black .
mypy .

# Tests con cobertura
pytest --cov=src --cov-report=html

# Profiling de algoritmos
python -m cProfile -o profile.stats src/benchmark.py
```

### 3. Frontend Web (React)

```bash
# Navegar a la carpeta
cd frontend-web

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Ejecutar tests
npm test

# Ejecutar tests E2E
npm run test:e2e

# Ver aplicación
# http://localhost:3000
```

**Estructura de desarrollo:**
```
frontend-web/
├── src/
│   ├── components/               # Componentes reutilizables
│   ├── features/                # Features por dominio
│   ├── hooks/                   # Custom hooks
│   ├── services/                # API clients
│   └── types/                   # TypeScript types
└── tests/                       # Tests por tipo
```

**Comandos útiles:**
```bash
# Generar tipos desde OpenAPI
npm run generate-types

# Build para producción
npm run build

# Análisis de bundle
npm run analyze

# Storybook (componentes)
npm run storybook
```

---

## FLUJO DE DESARROLLO RECOMENDADO

### 1. Desarrollo Feature-First

```bash
# 1. Crear rama para feature
git checkout -b feature/material-management

# 2. Desarrollar backend primero (TDD)
cd backend-api
# - Escribir tests
# - Implementar domain entities
# - Implementar use cases
# - Implementar API endpoints

# 3. Desarrollar optimization engine (si necesario)
cd ../optimization-engine
# - Implementar algoritmos
# - Crear endpoints

# 4. Desarrollar frontend
cd ../frontend-web
# - Generar tipos desde OpenAPI
# - Implementar componentes
# - Integrar con API

# 5. Testing de integración
docker-compose up -d
npm run test:e2e
```

### 2. Testing Strategy

```bash
# Tests unitarios (cada aplicación)
cd backend-api && dotnet test
cd optimization-engine && pytest
cd frontend-web && npm test

# Tests de integración
docker-compose -f docker-compose.test.yml up --abort-on-container-exit

# Tests E2E
cd frontend-web && npm run test:e2e

# Performance testing
cd optimization-engine && python benchmark.py
```

### 3. Code Quality

```bash
# Backend (.NET)
dotnet format
dotnet build --verbosity normal

# Optimization Engine (Python)
cd optimization-engine
flake8 . --statistics                    # Linting detallado
black . --check --diff                   # Verificar formateo
mypy . --strict                          # Type checking estricto
isort . --check-only --profile black     # Verificar imports
bandit -r . -f json -o bandit-report.json  # Security linting
safety check                             # Vulnerability check

# Pre-commit (recomendado)
pre-commit run --all-files               # Ejecutar todos los checks

# Frontend (React)
npm run lint
npm run type-check
npm run format
```

### Configuración de Calidad - Python

El proyecto usa las siguientes herramientas para mantener calidad de código:

#### Flake8 (Linting)
- **Configuración**: `.flake8`
- **Longitud de línea**: 88 caracteres (compatible con Black)
- **Plugins**: docstrings, import-order, bugbear, comprehensions
- **Complejidad máxima**: 10

#### Black (Formateo)
- **Estilo**: Automático, sin configuración
- **Longitud de línea**: 88 caracteres
- **Compatible**: Con flake8 e isort

#### MyPy (Type Checking)
- **Configuración**: `mypy.ini`
- **Modo**: Estricto para código de producción
- **Tests**: Menos estricto para flexibilidad

#### Pre-commit Hooks
- **Instalación**: `pre-commit install`
- **Ejecución**: Automática en cada commit
- **Incluye**: flake8, black, mypy, bandit, safety

---

## DEBUGGING

### 1. Backend API
```bash
# Logs en tiempo real
docker-compose logs -f backend-api

# Debug con VS Code
# Usar launch.json configurado

# Profiling de queries
# Habilitar logging de EF Core en appsettings.Development.json
```

### 2. Optimization Engine
```bash
# Logs detallados
export LOG_LEVEL=DEBUG
python -m uvicorn src.main:app --reload

# Debug de algoritmos
python -m pdb src/algorithms/genetic.py

# Memory profiling
pip install memory-profiler
python -m memory_profiler src/benchmark.py

# Linting completo
flake8 . --statistics --tee --output-file=flake8-report.txt
```

### 3. Frontend Web
```bash
# React DevTools
# Instalar extensión del navegador

# Redux DevTools (si se usa)
# Configurado automáticamente en desarrollo

# Network debugging
# Usar herramientas del navegador
```

---

## BASE DE DATOS

### Migraciones
```bash
# Backend: Entity Framework
cd backend-api
dotnet ef migrations add NombreMigracion
dotnet ef database update

# Rollback
dotnet ef database update PreviousMigration
```

### Seed Data
```bash
# Ejecutar seed data
cd backend-api
dotnet run --seed-data

# O usar SQL scripts
psql -h localhost -U maxicortes -d maxicortes -f scripts/seed-data.sql
```

### Backup y Restore
```bash
# Backup
docker exec maxicortes-postgres pg_dump -U maxicortes maxicortes > backup.sql

# Restore
docker exec -i maxicortes-postgres psql -U maxicortes maxicortes < backup.sql
```

---

## DEPLOYMENT

### Desarrollo Local
```bash
# Todo el stack
docker-compose up -d

# Solo infraestructura
docker-compose up -d postgres redis

# Con monitoring
docker-compose --profile monitoring up -d
```

### Staging
```bash
# Build de imágenes
docker-compose -f docker-compose.staging.yml build

# Deploy
docker-compose -f docker-compose.staging.yml up -d

# Health checks
curl http://localhost:5000/health
curl http://localhost:8000/health
```

### Producción
```bash
# Build optimizado
docker-compose -f docker-compose.prod.yml build

# Deploy con nginx
docker-compose -f docker-compose.prod.yml --profile production up -d
```

---

## MONITOREO Y LOGS

### Logs Centralizados
```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Logs específicos
docker-compose logs -f backend-api
docker-compose logs -f optimization-engine
docker-compose logs -f frontend-web
```

### Métricas
```bash
# Prometheus metrics
curl http://localhost:9090/metrics

# Application metrics
curl http://localhost:5000/metrics
curl http://localhost:8000/metrics
```

### Health Checks
```bash
# Backend API
curl http://localhost:5000/health

# Optimization Engine
curl http://localhost:8000/health

# Database
docker exec maxicortes-postgres pg_isready -U maxicortes
```

---

## TROUBLESHOOTING

### Problemas Comunes

#### 1. Puerto ya en uso
```bash
# Encontrar proceso usando el puerto
netstat -tulpn | grep :5000
# o
lsof -i :5000

# Matar proceso
kill -9 <PID>
```

#### 2. Base de datos no conecta
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps postgres

# Verificar logs
docker-compose logs postgres

# Conectar manualmente
docker exec -it maxicortes-postgres psql -U maxicortes -d maxicortes
```

#### 3. Optimization Engine timeout
```bash
# Verificar recursos del sistema
docker stats

# Aumentar timeout en backend
# appsettings.json -> OptimizationEngine:TimeoutSeconds

# Verificar logs del engine
docker-compose logs optimization-engine
```

#### 4. Frontend no carga
```bash
# Verificar que backend esté disponible
curl http://localhost:5000/health

# Verificar variables de entorno
echo $VITE_API_BASE_URL

# Limpiar cache
rm -rf node_modules/.vite
npm run dev
```

### Performance Issues

#### Backend API
```bash
# Profiling de queries
# Habilitar logging detallado en EF Core

# Memory profiling
dotnet-counters monitor --process-id <PID>
```

#### Optimization Engine
```bash
# CPU profiling
python -m cProfile -o profile.stats src/main.py

# Memory profiling
python -m memory_profiler src/algorithms/genetic.py
```

#### Frontend
```bash
# Bundle analysis
npm run analyze

# Performance profiling
# Usar Chrome DevTools -> Performance tab
```

---

## CONTRIBUCIÓN

### Workflow
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Desarrollar siguiendo TDD
4. Ejecutar todos los tests
5. Commit con mensajes descriptivos
6. Push y crear Pull Request

### Estándares de Código
- **Backend**: Seguir convenciones de C# y .NET
- **Python**: PEP 8, type hints obligatorios
- **Frontend**: ESLint + Prettier, TypeScript estricto
- **Tests**: Cobertura mínima 90%
- **Commits**: Conventional Commits

### Code Review Checklist
- [ ] Tests pasando (unitarios, integración, E2E)
- [ ] Cobertura de código ≥ 90%
- [ ] Documentación actualizada
- [ ] Performance no degradada
- [ ] Security best practices
- [ ] Accessibility compliance (frontend)