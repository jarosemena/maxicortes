# SISTEMA DE OPTIMIZACIÓN DE CORTE 2D - MAXICORTES

## 🎯 OBJETIVO

Desarrollar un sistema integral que optimice el corte de materiales en láminas (madera, metal, vidrio) minimizando el desperdicio mediante algoritmos de nesting 2D, con visualización interactiva y gestión completa de órdenes.

## 🏗️ ARQUITECTURA DEL SISTEMA

Este proyecto está dividido en **3 aplicaciones independientes** que trabajan en conjunto:

```
maxicortes/
├── backend-api/          # API REST (.NET Core)
├── optimization-engine/  # Motor de Optimización (Python)
├── frontend-web/         # Interfaz Web (React)
├── docs/                # Documentación compartida
└── docker-compose.yml   # Orquestación de servicios
```

## 📋 APLICACIONES

### 1. Backend API (.NET Core)
- **Propósito**: API REST para gestión de datos y orquestación
- **Tecnologías**: .NET 8, Entity Framework Core, PostgreSQL, Redis
- **Responsabilidades**:
  - Gestión de materiales, órdenes y usuarios
  - Autenticación y autorización JWT
  - Comunicación con motor de optimización
  - Almacenamiento de resultados y métricas
  - Upload y procesamiento de archivos CSV/Excel

### 2. Optimization Engine (Python)
- **Propósito**: Motor de cálculo para algoritmos de nesting 2D
- **Tecnologías**: Python 3.11+, FastAPI, Shapely, OR-Tools, NumPy
- **Responsabilidades**:
  - Algoritmos de cutting stock problem 2D
  - Optimización de patrones de corte (Genetic, Simulated Annealing)
  - Cálculo de métricas de eficiencia
  - Procesamiento de geometrías complejas (polígonos, círculos, óvalos)
  - Soporte para parámetros de tolerancia configurables

### 3. Frontend Web (React)
- **Propósito**: Interfaz de usuario interactiva y responsive
- **Tecnologías**: React 18, TypeScript, Vite, Material-UI, Konva.js
- **Responsabilidades**:
  - Gestión de órdenes multi-material
  - Visualización 2D interactiva de patrones de corte
  - Upload y validación de archivos CSV/Excel
  - Dashboard de métricas y reportes
  - Configuración de parámetros de tolerancia

## 🔄 FLUJO DE DATOS

```
Frontend Web ──REST API──► Backend API ──HTTP JSON──► Optimization Engine
     ▲                           │                            │
     │                           ▼                            │
     └────── Resultados ◄─── PostgreSQL ◄─────────────────────┘
                              │
                              ▼
                           Redis Cache
```

## 🚀 INICIO RÁPIDO

### Prerrequisitos
- Docker y Docker Compose
- Git

### Setup Completo
```bash
# Clonar repositorio
git clone <repository-url>
cd maxicortes

# Levantar todo el stack
docker-compose up -d

# Verificar que todos los servicios estén corriendo
docker-compose ps

# Acceder a las aplicaciones
# Frontend:  http://localhost:3000
# Backend:   http://localhost:5000/swagger
# Optimization: http://localhost:8000/docs
```

### Desarrollo Individual
```bash
# Backend API (.NET)
cd backend-api
dotnet restore
dotnet run

# Optimization Engine (Python)
cd optimization-engine
pip install -r requirements.txt
uvicorn src.main:app --reload

# Frontend Web (React)
cd frontend-web
npm install
npm run dev
```

## 📚 DOCUMENTACIÓN

### Planes de Desarrollo Detallados
- 📘 [Backend API - Plan de Tareas](backend-api/TASKS.md)
- 🐍 [Optimization Engine - Plan de Tareas](optimization-engine/TASKS.md)
- ⚛️ [Frontend Web - Plan de Tareas](frontend-web/TASKS.md)

### Documentación Técnica
- 🔗 [Plan de Integración](docs/INTEGRATION_PLAN.md)
- 🛠️ [Guía de Desarrollo](DEVELOPMENT_GUIDE.md)

## 🎯 MÉTRICAS DE ÉXITO

### Funcionales
- ✅ **Reducción de desperdicio**: ≥ 15-20%
- ✅ **Tiempo de optimización**: < 2 minutos para órdenes complejas
- ✅ **Soporte multi-material**: Una orden con diferentes tipos de materiales
- ✅ **Geometrías soportadas**: Polígonos, círculos, óvalos
- ✅ **Interfaz intuitiva**: Para operarios no técnicos

### Técnicas
- ✅ **Cobertura de tests**: ≥ 90%
- ✅ **Performance API**: < 200ms p95
- ✅ **Uptime**: ≥ 99.9%
- ✅ **Escalabilidad**: 1000+ requests/segundo

## 🏛️ ARQUITECTURA TÉCNICA

### Patrones Implementados
- **Clean Architecture** (Hexagonal) en todas las aplicaciones
- **TDD** (Test-Driven Development) obligatorio
- **Domain-Driven Design** para modelado de negocio
- **CQRS** para separación de comandos y consultas
- **Event Sourcing** para auditoría de cambios

### Stack Tecnológico
```
Frontend:  React 18 + TypeScript + Vite + Material-UI + Konva.js
Backend:   .NET 8 + Entity Framework Core + PostgreSQL + Redis
Engine:    Python 3.11+ + FastAPI + Shapely + OR-Tools + NumPy
DevOps:    Docker + Docker Compose + GitHub Actions
Testing:   xUnit + Pytest + Vitest + Playwright
```

## 🔧 SERVICIOS Y PUERTOS

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| Frontend Web | 3000 | Interfaz de usuario React |
| Backend API | 5000 | API REST .NET Core |
| Optimization Engine | 8000 | Motor de algoritmos Python |
| PostgreSQL | 5432 | Base de datos principal |
| Redis | 6379 | Cache y sesiones |
| Nginx | 80/443 | Reverse proxy (producción) |
| Prometheus | 9090 | Métricas (monitoring) |
| Grafana | 3001 | Dashboards (monitoring) |

## 📊 FUNCIONALIDADES PRINCIPALES

### Gestión de Materiales
- Catálogo con dimensiones estándar
- Control de stock en tiempo real
- Costos por material y tipo
- Soporte para madera, metal, vidrio

### Gestión de Órdenes
- Órdenes multi-material
- Ingesta via formularios, CSV, Excel
- Estados: Pendiente → Procesando → Completado
- Seguimiento completo del ciclo de vida

### Motor de Optimización
- Algoritmos: Genetic, Simulated Annealing, Beam Search
- Soporte para formas irregulares
- Parámetros de tolerancia configurables
- Rotaciones automáticas para optimización

### Visualización 2D
- Canvas interactivo con zoom y pan
- Renderizado de patrones de corte
- Métricas de eficiencia en tiempo real
- Exportación a PDF/DXF

## 🧪 TESTING STRATEGY

### Cobertura por Capa
- **Domain Layer**: 100% (lógica de negocio crítica)
- **Application Layer**: 100% (casos de uso)
- **Infrastructure Layer**: ≥90% (integraciones)
- **Presentation Layer**: ≥90% (APIs y UI)

### Tipos de Tests
- **Unit Tests**: Lógica de negocio y algoritmos
- **Integration Tests**: APIs y base de datos
- **E2E Tests**: Flujos completos de usuario
- **Performance Tests**: Carga y optimización
- **Contract Tests**: Integración entre servicios

## 🚀 DEPLOYMENT

### Ambientes
```bash
# Desarrollo local
docker-compose up -d

# Staging
docker-compose -f docker-compose.staging.yml up -d

# Producción
docker-compose -f docker-compose.prod.yml --profile production up -d

# Con monitoring
docker-compose --profile monitoring up -d
```

### CI/CD Pipeline
- **Build**: Compilación y tests automáticos
- **Test**: Cobertura y quality gates
- **Security**: Análisis de vulnerabilidades
- **Deploy**: Despliegue automático por ambiente

## 🤝 CONTRIBUCIÓN

1. Fork del repositorio
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Desarrollar siguiendo TDD
4. Tests con cobertura ≥90%
5. Pull Request con descripción detallada

### Estándares
- **Commits**: Conventional Commits
- **Code Style**: Linters configurados por tecnología
- **Documentation**: Actualizar con cada cambio
- **Testing**: TDD obligatorio

## 📞 SOPORTE

- **Issues**: GitHub Issues para bugs y features
- **Documentación**: Wiki del proyecto
- **Desarrollo**: Ver [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)

---

**Desarrollado con ❤️ para optimizar el uso de materiales industriales**