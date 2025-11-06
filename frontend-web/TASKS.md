# FRONTEND WEB (REACT) - PLAN DE DESARROLLO

## INFORMACIÓN GENERAL

**Tecnologías**: React 18, TypeScript, Vite, Material-UI, Konva.js, React Query
**Arquitectura**: Component-based con Clean Architecture principles
**Testing**: TDD obligatorio, cobertura ≥ 90%
**Duración Estimada**: 6-8 semanas

---

## FASE 0: DISEÑO Y PLANIFICACIÓN (Semana 1)

### T001: Configuración Inicial del Proyecto
- [x] Setup proyecto React con Vite + TypeScript
- [x] Configurar estructura de carpetas (Arquitectura Hexagonal)
- [x] Setup de Docker y docker-compose
- [x] Configurar CI/CD pipeline (GitHub Actions)
- [x] Setup de herramientas de desarrollo (ESLint, Prettier, Husky)

**Estructura de Carpetas:**
```
frontend-web/
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                  # Componentes base (Button, Input, etc.)
│   │   ├── layout/              # Layout components
│   │   └── common/              # Componentes comunes
│   ├── features/                # Features por dominio
│   │   ├── materials/
│   │   ├── orders/
│   │   ├── optimization/
│   │   └── visualization/
│   ├── hooks/                   # Custom hooks
│   ├── services/                # API clients
│   ├── types/                   # TypeScript types
│   ├── utils/                   # Utilidades
│   └── assets/                  # Imágenes, iconos, etc.
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
├── docs/
└── public/
```

### T002: Diseño de UI/UX
- [ ] Crear wireframes de todas las pantallas
- [ ] Definir sistema de diseño (colores, tipografías, espaciado)
- [ ] Crear componentes base en Figma/Sketch
- [ ] Definir flujos de usuario principales
- [ ] Documentar patrones de interacción

**Pantallas Principales:**
```
1. Dashboard - Resumen de órdenes y métricas
2. Gestión de Materiales - CRUD de materiales
3. Crear Orden - Formulario multi-material
4. Lista de Órdenes - Tabla con filtros y paginación
5. Detalle de Orden - Información completa + optimización
6. Visualización 2D - Canvas interactivo de patrones
7. Configuración - Parámetros de tolerancia
8. Reportes - Métricas y análisis
```

### T003: Definición de Tipos TypeScript
- [x] Definir tipos para geometrías (Polygon, Circle, Oval)
- [x] Crear entidades del dominio (Material, Order, Optimization)
- [x] Definir interfaces de repositorios
- [x] Crear casos de uso básicos
- [ ] Generar tipos desde OpenAPI del backend
- [ ] Crear interfaces para componentes
- [ ] Definir tipos para estado global
- [ ] Documentar convenciones de tipado

---

## FASE 1: COMPONENTES BASE Y LAYOUT (Semana 2)

### T004: Sistema de Diseño (TDD)
- [x] **Theme Provider**
  - Colores, tipografías, espaciado
  - Modo claro/oscuro
  - Responsive breakpoints
  - Tests: Renderizado correcto
  
- [x] **Componentes UI Base**
  - Button, Input, Modal, Loading
  - Props, eventos, accesibilidad
  - Tests: Casos de uso completos
  
- [x] **Layout Components**
  - AppLayout con navegación
  - Responsive drawer
  - Theme toggle
  - Tests: Responsive behavior

### T005: Gestión de Estado (TDD)
- [ ] **Zustand Store Setup**
  - Store para materiales
  - Store para órdenes
  - Store para optimización
  - Store para UI state
  - Tests: Actions y reducers
  
- [ ] **React Query Configuration**
  - Query client setup
  - Cache configuration
  - Error handling
  - Optimistic updates
  - Tests: Queries y mutations

### T006: Routing y Navegación (TDD)
- [ ] **React Router Setup**
  - Rutas principales
  - Rutas protegidas
  - Lazy loading de componentes
  - Tests: Navegación correcta
  
- [ ] **Navigation Components**
  - Menu principal
  - Breadcrumbs dinámicos
  - Back button
  - Tests: Links y navegación

---

## FASE 2: GESTIÓN DE MATERIALES (Semana 3)

### T007: Lista de Materiales (TDD)
- [ ] **MaterialsList Component**
  - Tabla con paginación
  - Filtros por tipo, disponibilidad
  - Ordenamiento por columnas
  - Búsqueda por nombre
  - Tests: Filtros, paginación, ordenamiento
  
- [ ] **MaterialCard Component**
  - Vista de tarjeta individual
  - Información clave visible
  - Acciones rápidas (editar, eliminar)
  - Tests: Renderizado y acciones
  
- [ ] **MaterialFilters Component**
  - Filtros avanzados
  - Reset de filtros
  - Persistencia en URL
  - Tests: Aplicación de filtros

### T008: CRUD de Materiales (TDD)
- [ ] **CreateMaterial Component**
  - Formulario con validación
  - Upload de imagen (opcional)
  - Preview de datos
  - Tests: Validación y envío
  
- [ ] **EditMaterial Component**
  - Formulario pre-poblado
  - Validación de cambios
  - Confirmación de guardado
  - Tests: Edición y validación
  
- [ ] **MaterialForm Component**
  - Formulario reutilizable
  - Validación con Yup/Zod
  - Manejo de errores
  - Tests: Casos válidos e inválidos

### T009: Integración con API (TDD)
- [ ] **Materials API Client**
  - CRUD operations
  - Error handling
  - Loading states
  - Tests: Mocks de API
  
- [ ] **Materials Hooks**
  - useMaterials, useMaterial
  - useCreateMaterial, useUpdateMaterial
  - useDeleteMaterial
  - Tests: Estados y side effects

---

## FASE 3: GESTIÓN DE ÓRDENES (Semana 4)

### T010: Lista de Órdenes (TDD)
- [ ] **OrdersList Component**
  - Tabla con estados visuales
  - Filtros por estado, fecha, cliente
  - Acciones por fila (ver, editar, cancelar)
  - Tests: Diferentes estados y filtros
  
- [ ] **OrderStatusBadge Component**
  - Badge visual por estado
  - Colores semánticos
  - Tooltip con información
  - Tests: Todos los estados
  
- [ ] **OrderFilters Component**
  - Filtros por fecha (date picker)
  - Filtros por estado múltiple
  - Búsqueda por número de orden
  - Tests: Combinaciones de filtros

### T011: Crear Orden Multi-Material (TDD)
- [ ] **CreateOrder Component**
  - Wizard multi-paso
  - Selección de materiales
  - Agregado de piezas
  - Preview final
  - Tests: Flujo completo
  
- [ ] **MaterialSelector Component**
  - Lista de materiales disponibles
  - Filtros por tipo
  - Información de stock
  - Tests: Selección múltiple
  
- [ ] **PieceEditor Component**
  - Formulario para cada pieza
  - Selector de geometría
  - Parámetros de tolerancia
  - Tests: Diferentes tipos de geometría

### T012: Geometrías y Validación (TDD)
- [ ] **GeometryInput Component**
  - Input para polígonos (coordenadas)
  - Input para círculos (radio)
  - Input para óvalos (ancho/alto)
  - Validación en tiempo real
  - Tests: Geometrías válidas e inválidas
  
- [ ] **GeometryPreview Component**
  - Preview visual de geometría
  - Canvas pequeño con Konva
  - Información de área
  - Tests: Renderizado correcto
  
- [ ] **FileUpload Component**
  - Upload de CSV/Excel
  - Validación de formato
  - Preview de datos
  - Progress indicator
  - Tests: Diferentes formatos de archivo

---

## FASE 4: VISUALIZACIÓN 2D (Semana 5)

### T013: Canvas de Visualización (TDD)
- [ ] **VisualizationCanvas Component**
  - Canvas con Konva.js
  - Zoom y pan
  - Renderizado de materiales
  - Renderizado de piezas
  - Tests: Interacciones básicas
  
- [ ] **MaterialSheet Component**
  - Representación visual del material
  - Dimensiones y escala
  - Grid de referencia
  - Tests: Diferentes tamaños
  
- [ ] **PieceShape Component**
  - Renderizado de polígonos
  - Renderizado de círculos/óvalos
  - Colores por estado
  - Tooltips informativos
  - Tests: Diferentes geometrías

### T014: Interactividad del Canvas (TDD)
- [ ] **ZoomPan Controls**
  - Zoom con mouse wheel
  - Pan con drag
  - Zoom to fit
  - Reset view
  - Tests: Todas las interacciones
  
- [ ] **Selection System**
  - Selección de piezas
  - Multi-selección
  - Highlight visual
  - Tests: Selección correcta
  
- [ ] **Measurement Tools**
  - Herramienta de medición
  - Mostrar dimensiones
  - Cálculo de áreas
  - Tests: Precisión de mediciones

### T015: Panel de Métricas (TDD)
- [ ] **MetricsPanel Component**
  - Utilización de material
  - Porcentaje de desperdicio
  - Costo total y ahorros
  - Tiempo de optimización
  - Tests: Cálculos correctos
  
- [ ] **EfficiencyChart Component**
  - Gráfico de barras/pie
  - Comparación con benchmarks
  - Animaciones suaves
  - Tests: Renderizado de datos
  
- [ ] **WasteVisualization Component**
  - Visualización de desperdicios
  - Áreas no utilizadas
  - Sugerencias de mejora
  - Tests: Identificación correcta

---

## FASE 5: OPTIMIZACIÓN E INTEGRACIÓN (Semana 6)

### T016: Proceso de Optimización (TDD)
- [ ] **OptimizationTrigger Component**
  - Botón de optimizar
  - Configuración de parámetros
  - Validación previa
  - Tests: Diferentes configuraciones
  
- [ ] **OptimizationProgress Component**
  - Progress bar animado
  - Tiempo estimado
  - Cancelación de proceso
  - Tests: Estados de progreso
  
- [ ] **OptimizationResults Component**
  - Resultados tabulares
  - Comparación de opciones
  - Selección de mejor resultado
  - Tests: Diferentes resultados

### T017: Configuración Avanzada (TDD)
- [ ] **ToleranceSettings Component**
  - Parámetros por material
  - Valores por defecto
  - Validación de rangos
  - Tests: Configuraciones válidas
  
- [ ] **AlgorithmSelector Component**
  - Selección de algoritmo
  - Parámetros específicos
  - Información de performance
  - Tests: Diferentes algoritmos
  
- [ ] **ExportOptions Component**
  - Exportar a PDF/DXF
  - Configuración de formato
  - Preview de exportación
  - Tests: Diferentes formatos

### T018: Integración con APIs (TDD)
- [ ] **Orders API Client**
  - CRUD operations completas
  - Upload de archivos
  - Manejo de errores
  - Tests: Todos los endpoints
  
- [ ] **Optimization API Client**
  - Trigger optimization
  - Poll for results
  - Handle timeouts
  - Tests: Diferentes escenarios
  
- [ ] **Error Handling**
  - Error boundaries
  - Toast notifications
  - Retry mechanisms
  - Tests: Recuperación de errores

---

## FASE 6: TESTING Y OPTIMIZACIÓN (Semana 7)

### T019: Unit Tests Completion
- [ ] **Components**: ≥90% cobertura
  - Todos los componentes principales
  - Props y eventos
  - Estados internos
  
- [ ] **Hooks**: 100% cobertura
  - Custom hooks
  - Side effects
  - Error handling
  
- [ ] **Utils**: 100% cobertura
  - Funciones de utilidad
  - Validaciones
  - Transformaciones

### T020: Integration Tests
- [ ] **Feature Tests**
  - Flujos completos por feature
  - Integración entre componentes
  - API integration
  
- [ ] **E2E Tests (Playwright)**
  - Flujo completo de crear orden
  - Proceso de optimización
  - Visualización de resultados
  
- [ ] **Accessibility Tests**
  - WCAG compliance
  - Keyboard navigation
  - Screen reader support

### T021: Performance Optimization
- [ ] **Bundle Optimization**
  - Code splitting
  - Lazy loading
  - Tree shaking
  
- [ ] **Runtime Performance**
  - React.memo optimization
  - useMemo/useCallback
  - Virtual scrolling
  
- [ ] **Canvas Performance**
  - Konva optimization
  - Efficient rendering
  - Memory management

---

## FASE 7: DEPLOYMENT Y OPERACIONES (Semana 8)

### T022: Build y Deployment
- [ ] **Production Build**
  - Optimización de assets
  - Environment variables
  - Source maps
  
- [ ] **Docker Configuration**
  - Multi-stage Dockerfile
  - Nginx configuration
  - Health checks
  
- [ ] **CI/CD Pipeline**
  - Automated testing
  - Build optimization
  - Deployment automation

### T023: Monitoring y Analytics
- [ ] **Error Tracking**
  - Sentry integration
  - Error boundaries
  - User feedback
  
- [ ] **Performance Monitoring**
  - Web Vitals
  - Bundle analysis
  - Runtime performance
  
- [ ] **User Analytics**
  - Usage tracking
  - Feature adoption
  - Performance metrics

### T024: Documentation
- [ ] **User Documentation**
  - User manual
  - Feature guides
  - Troubleshooting
  
- [ ] **Developer Documentation**
  - Component library
  - API integration
  - Deployment guide
  
- [ ] **Design System**
  - Storybook setup
  - Component documentation
  - Usage examples

---

## CRITERIOS DE ACEPTACIÓN

### Por Fase:
- **Fase 1-2**: ✅ Componentes base + Layout funcionando
- **Fase 3**: ✅ Gestión completa de materiales y órdenes
- **Fase 4**: ✅ Visualización 2D interactiva
- **Fase 5**: ✅ Integración completa con backend
- **Fase 6**: ✅ Tests y performance optimizada
- **Fase 7**: ✅ Deployment automatizado

### Finales:
- [ ] Cobertura de tests ≥ 90%
- [ ] Performance: LCP < 2.5s, FID < 100ms
- [ ] Accessibility: WCAG AA compliance
- [ ] Cross-browser: Chrome, Firefox, Safari, Edge
- [ ] Responsive: Mobile, tablet, desktop
- [ ] PWA: Offline capability básica

---

## COMPONENTES PRINCIPALES

### Core Components:
1. **MaterialsList** - Gestión de materiales
2. **CreateOrder** - Wizard de creación de órdenes
3. **VisualizationCanvas** - Canvas 2D interactivo
4. **OptimizationResults** - Resultados y métricas
5. **GeometryInput** - Editor de geometrías
6. **FileUpload** - Upload de CSV/Excel
7. **MetricsPanel** - Dashboard de métricas
8. **ToleranceSettings** - Configuración avanzada

### Performance Targets:
- **Bundle size**: < 1MB gzipped
- **First Load**: < 3 segundos
- **Canvas rendering**: 60fps
- **Memory usage**: < 100MB

---

## DEPENDENCIAS PRINCIPALES

### Core:
- **React 18**: Framework principal
- **TypeScript**: Type safety
- **Vite**: Build tool
- **React Router**: Routing

### UI/UX:
- **Material-UI**: Component library
- **Konva.js**: Canvas 2D
- **React Hook Form**: Form handling
- **Framer Motion**: Animations

### State Management:
- **Zustand**: Global state
- **React Query**: Server state
- **Immer**: Immutable updates

### Testing:
- **Vitest**: Unit testing
- **Testing Library**: Component testing
- **Playwright**: E2E testing

---

## RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Performance del canvas | Media | Alto | Optimización temprana, profiling |
| Complejidad de geometrías | Alta | Medio | Validación robusta, casos de prueba |
| UX de visualización | Media | Alto | Testing con usuarios, iteración |
| Integración con backend | Baja | Alto | Contratos claros, mocks |

---

## MÉTRICAS DE ÉXITO

### Técnicas:
- Cobertura de tests ≥ 90%
- Performance score > 90 (Lighthouse)
- Bundle size < 1MB
- Zero accessibility violations

### Funcionales:
- Gestión completa de materiales
- Creación de órdenes multi-material
- Visualización 2D interactiva
- Upload y procesamiento de archivos
- Integración completa con optimización