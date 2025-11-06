# BACKEND API (.NET CORE) - PLAN DE DESARROLLO

## INFORMACIÓN GENERAL

**Tecnologías**: .NET 8, Entity Framework Core, PostgreSQL, Redis, Docker
**Arquitectura**: Hexagonal (Clean Architecture)
**Testing**: TDD obligatorio, cobertura ≥ 90%
**Duración Estimada**: 6-8 semanas

---

## FASE 0: DISEÑO Y PLANIFICACIÓN (Semana 1)

### T001: Configuración Inicial del Proyecto
- [x] Crear proyecto .NET 8 Web API
- [x] Configurar estructura de carpetas (Clean Architecture)
- [x] Setup de Docker y docker-compose
- [ ] Configurar CI/CD pipeline (GitHub Actions)
- [x] Setup de herramientas de desarrollo (linters, formatters)

**Estructura de Carpetas:**
```
backend-api/
├── src/
│   ├── MaxiCortes.Domain/          # Entidades, VOs, Reglas de Negocio
│   ├── MaxiCortes.Application/     # Casos de Uso, DTOs, Interfaces
│   ├── MaxiCortes.Infrastructure/  # Repositorios, DB, APIs Externas
│   └── MaxiCortes.WebAPI/         # Controllers, Middleware
├── tests/
│   ├── MaxiCortes.Domain.Tests/
│   ├── MaxiCortes.Application.Tests/
│   ├── MaxiCortes.Infrastructure.Tests/
│   └── MaxiCortes.WebAPI.Tests/
└── docs/
```

### T002: Diseño de Base de Datos
- [x] Crear diagrama ER completo
- [x] Definir esquema SQL para PostgreSQL
- [x] Diseñar índices para optimización
- [x] Crear script de migración inicial
- [x] Documentar modelo de datos

**Tablas Principales:**
```sql
-- Materials: Catálogo de materiales
-- Orders: Órdenes multi-material
-- OrderItems: Piezas con geometrías
-- CutOptimizationResults: Resultados de optimización
-- CutPatterns: Patrones por plancha
-- CutPatternPieces: Piezas colocadas
-- WastePieces: Tracking de desperdicios
-- Users: Gestión de usuarios
```

### T003: Definición de APIs REST
- [ ] Especificar endpoints completos (OpenAPI 3.0)
- [ ] Definir DTOs para request/response
- [ ] Diseñar contratos de integración con Python
- [ ] Documentar formatos de geometrías
- [ ] Crear ejemplos de uso

---

## FASE 1: DOMAIN LAYER (Semana 2)

### T004: Entidades del Dominio (TDD)
- [x] **Material Entity**
  - Propiedades: Id, Name, Type, Width, Height, Thickness, Cost, Stock
  - Reglas: Validación de dimensiones, stock no negativo
  - Tests: 100% cobertura
  
- [ ] **Order Entity (Aggregate Root)**
  - Propiedades: Id, OrderNumber, CustomerId, Status, CreatedAt
  - Métodos: AddItem(), RemoveItem(), CalculateTotal(), CanCancel()
  - Reglas: Estado válido, items no vacíos, límites por cliente
  - Tests: 100% cobertura

- [ ] **OrderItem Entity**
  - Propiedades: Id, OrderId, MaterialId, Geometry, Quantity, Priority
  - Soporte: Polígonos, círculos, óvalos
  - Validación: Geometría válida, cantidad positiva
  - Tests: 100% cobertura

### T005: Value Objects (TDD)
- [x] **Money VO**
  - Propiedades: Amount, Currency
  - Inmutable, validación de moneda
  - Operaciones: Add, Subtract, Multiply
  
- [ ] **Geometry VO**
  - Tipos: Polygon, Circle, Oval
  - Validación: Coordenadas válidas, área positiva
  - Serialización: JSON compatible
  
- [x] **Dimensions VO**
  - Propiedades: Width, Height, Thickness
  - Validación: Valores positivos

### T006: Domain Services (TDD)
- [ ] **OrderValidationService**
  - ValidateStock(): Verificar disponibilidad
  - ValidateCustomerLimits(): Máximo 5 órdenes pendientes
  - ValidateGeometry(): Geometrías válidas
  - Tests: 100% cobertura

- [ ] **CostCalculationService**
  - CalculateOrderCost(): Costo total por materiales
  - CalculateWasteCost(): Costo de desperdicio
  - Tests: 100% cobertura

### T007: Domain Events (TDD)
- [ ] OrderCreated, OrderValidated, OrderCancelled
- [ ] MaterialStockUpdated, OptimizationRequested
- [ ] Event handlers interfaces
- [ ] Tests: Verificar eventos disparados

---

## FASE 2: APPLICATION LAYER (Semana 3)

### T008: DTOs y Mappers
- [ ] **Request DTOs**
  - CreateOrderRequest, UpdateMaterialRequest
  - GeometryDto (polígonos, círculos, óvalos)
  - OptimizationParametersDto
  
- [ ] **Response DTOs**
  - OrderResponse, MaterialResponse
  - OptimizationResultResponse
  - PaginatedResponse<T>
  
- [ ] **AutoMapper Configuration**
  - Entity ↔ DTO mappings
  - Tests de mapeo

### T009: Use Cases - Gestión de Materiales (TDD)
- [ ] **CreateMaterialUseCase**
  - Input: CreateMaterialRequest
  - Validación: Datos requeridos, dimensiones válidas
  - Output: MaterialResponse
  - Tests: Casos exitosos y de error
  
- [ ] **GetMaterialsUseCase**
  - Paginación, filtros por tipo
  - Ordenamiento por nombre, costo
  - Tests: Diferentes escenarios de filtrado
  
- [ ] **UpdateMaterialStockUseCase**
  - Actualización de stock
  - Validación: Stock no negativo
  - Event: MaterialStockUpdated

### T010: Use Cases - Gestión de Órdenes (TDD)
- [ ] **CreateOrderUseCase**
  - Input: CreateOrderRequest con múltiples materiales
  - Validación: Stock, límites de cliente, geometrías
  - Output: OrderResponse
  - Events: OrderCreated
  - Tests: Casos complejos multi-material
  
- [ ] **GetOrderDetailsUseCase**
  - Incluir items, materiales, resultados de optimización
  - Tests: Diferentes niveles de detalle
  
- [ ] **CancelOrderUseCase**
  - Validación: Solo órdenes pendientes
  - Restaurar stock
  - Event: OrderCancelled

### T011: Use Cases - Optimización (TDD)
- [ ] **RequestOptimizationUseCase**
  - Comunicación con servicio Python
  - Manejo de timeouts y errores
  - Almacenamiento de resultados
  - Tests: Mocks del servicio externo
  
- [ ] **GetOptimizationResultsUseCase**
  - Recuperar patrones de corte
  - Métricas de eficiencia
  - Tests: Diferentes formatos de resultado

---

## CRITERIOS DE ACEPTACIÓN FINALES

- [ ] Cobertura total ≥ 90%
- [ ] Todos los endpoints documentados (OpenAPI)
- [ ] Performance: <200ms p95, 1000 req/s
- [ ] Security: Autenticación JWT, rate limiting
- [ ] Observability: Logs, métricas, health checks
- [ ] Deployment: Docker, CI/CD funcional