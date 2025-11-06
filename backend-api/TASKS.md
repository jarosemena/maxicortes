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
  
- [x] **Order Entity (Aggregate Root)**
  - Propiedades: Id, OrderNumber, CustomerId, Status, CreatedAt
  - Métodos: AddItem(), RemoveItem(), CalculateTotal(), CanCancel()
  - Reglas: Estado válido, items no vacíos, límites por cliente
  - Tests: 100% cobertura

- [x] **OrderItem Entity**
  - Propiedades: Id, OrderId, MaterialId, Geometry, Quantity, Priority
  - Soporte: Polígonos, círculos, óvalos
  - Validación: Geometría válida, cantidad positiva
  - Tests: 100% cobertura

### T005: Value Objects (TDD)
- [x] **Money VO**
  - Propiedades: Amount, Currency
  - Inmutable, validación de moneda
  - Operaciones: Add, Subtract, Multiply
  
- [x] **Geometry VO**
  - Tipos: Polygon, Circle, Oval
  - Validación: Coordenadas válidas, área positiva
  - Serialización: JSON compatible
  
- [x] **Dimensions VO**
  - Propiedades: Width, Height, Thickness
  - Validación: Valores positivos

- [x] **Point VO**
  - Propiedades: X, Y coordinates
  - Operaciones: DistanceTo, Translate

### T006: Domain Services (TDD)
- [x] **OrderValidationService**
  - ValidateStock(): Verificar disponibilidad
  - ValidateCustomerLimits(): Máximo 5 órdenes pendientes
  - ValidateGeometry(): Geometrías válidas
  - Tests: Pendiente

- [x] **CostCalculationService**
  - CalculateOrderCost(): Costo total por materiales
  - CalculateWasteCost(): Costo de desperdicio
  - Tests: Pendiente

### T007: Domain Events (TDD)
- [x] OrderCreated, OrderValidated, OrderCancelled
- [x] MaterialStockUpdated, OptimizationRequested
- [x] Event handlers interfaces
- [ ] Tests: Verificar eventos disparados

---

## FASE 2: APPLICATION LAYER (Semana 3)

### T008: DTOs y Mappers
- [x] **Request DTOs**
  - CreateOrderRequest, UpdateMaterialRequest
  - GeometryDto (polígonos, círculos, óvalos)
  - OptimizationParametersDto
  
- [x] **Response DTOs**
  - OrderResponse, MaterialResponse
  - OptimizationResultResponse
  - PaginatedResponse<T>
  
- [x] **AutoMapper Configuration**
  - Entity ↔ DTO mappings
  - Tests de mapeo: Pendiente

### T009: Use Cases - Gestión de Materiales (TDD)
- [x] **CreateMaterialUseCase**
  - Input: CreateMaterialRequest
  - Validación: Datos requeridos, dimensiones válidas
  - Output: MaterialResponse
  - Tests: Pendiente
  
- [x] **GetMaterialsUseCase**
  - Paginación, filtros por tipo
  - Ordenamiento por nombre, costo
  - Tests: Pendiente
  
- [x] **UpdateMaterialStockUseCase**
  - Actualización de stock
  - Validación: Stock no negativo
  - Event: MaterialStockUpdated
  - Tests: Pendiente

### T010: Use Cases - Gestión de Órdenes (TDD)
- [x] **CreateOrderUseCase**
  - Input: CreateOrderRequest con múltiples materiales
  - Validación: Stock, límites de cliente, geometrías
  - Output: OrderResponse
  - Events: OrderCreated
  - Tests: Pendiente
  
- [x] **GetOrderDetailsUseCase**
  - Incluir items, materiales, resultados de optimización
  - Tests: Pendiente
  
- [x] **CancelOrderUseCase**
  - Validación: Solo órdenes pendientes
  - Restaurar stock
  - Event: OrderCancelled
  - Tests: Pendiente

### T011: Use Cases - Optimización (TDD)
- [x] **RequestOptimizationUseCase**
  - Comunicación con servicio Python
  - Manejo de timeouts y errores
  - Almacenamiento de resultados
  - Tests: Pendiente
  
- [x] **GetOptimizationResultsUseCase**
  - Recuperar patrones de corte
  - Métricas de eficiencia
  - Tests: Pendiente

---

## CRITERIOS DE ACEPTACIÓN FINALES

- [ ] Cobertura total ≥ 90%
- [ ] Todos los endpoints documentados (OpenAPI)
- [ ] Performance: <200ms p95, 1000 req/s
- [ ] Security: Autenticación JWT, rate limiting
- [ ] Observability: Logs, métricas, health checks
- [ ] Deployment: Docker, CI/CD funcional