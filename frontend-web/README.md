# MaxiCortes Frontend

Sistema de optimización de cortes de materiales - Interfaz web desarrollada con React 18, TypeScript y arquitectura hexagonal.

## 🚀 Características

- **React 18** con TypeScript estricto
- **Arquitectura Hexagonal** para separación de responsabilidades
- **TDD (Test-Driven Development)** con cobertura ≥90%
- **Material-UI** para componentes de interfaz
- **Konva.js** para visualización 2D interactiva
- **React Query** para gestión de estado del servidor
- **Zustand** para estado global de la aplicación
- **Vite** para desarrollo y build optimizado

## 📁 Estructura del Proyecto

```
src/
├── domain/              # Lógica de negocio pura
│   ├── entities/       # Material, Order, Geometry, Optimization
│   ├── repositories/   # Interfaces de repositorios
│   └── use-cases/      # Casos de uso de la aplicación
├── application/         # Capa de aplicación
│   ├── hooks/          # Custom hooks que orquestan use-cases
│   └── services/       # Servicios de aplicación
├── infrastructure/      # Adaptadores externos
│   ├── api/            # Cliente HTTP para backend
│   ├── storage/        # LocalStorage, SessionStorage
│   └── repositories/   # Implementaciones concretas
└── presentation/        # Capa de presentación
    ├── components/     # Componentes React
    ├── pages/          # Páginas/vistas
    └── styles/         # Estilos y tema
```

## 🛠️ Desarrollo

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>
cd frontend-web

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.development
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo
npm run build           # Build de producción
npm run preview         # Preview del build

# Testing
npm run test            # Tests en modo watch
npm run test:coverage   # Tests con reporte de cobertura
npm run test:e2e        # Tests end-to-end con Playwright

# Calidad de código
npm run lint            # Ejecutar ESLint
npm run lint:fix        # Corregir errores de ESLint
npm run type-check      # Verificar tipos TypeScript
npm run format          # Formatear código con Prettier
npm run format:check    # Verificar formato
```

### Variables de Entorno

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

## 🧪 Testing

El proyecto sigue **TDD (Test-Driven Development)** con cobertura mínima del 90%.

### Tipos de Tests

- **Unitarios**: Entidades, casos de uso, utilidades
- **Integración**: Componentes con dependencias
- **E2E**: Flujos completos de usuario

### Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Con cobertura
npm run test:coverage

# Tests E2E
npm run test:e2e
```

## 🏗️ Arquitectura

### Principios de Arquitectura Hexagonal

1. **Dominio**: Lógica de negocio pura, sin dependencias externas
2. **Aplicación**: Orquesta casos de uso y coordina el flujo
3. **Infraestructura**: Adaptadores para APIs, storage, etc.
4. **Presentación**: Componentes React y UI

### Flujo de Datos

```
UI Component → Custom Hook → Use Case → Repository Interface → API Client
```

### Entidades Principales

- **Material**: Materiales disponibles para corte
- **Order**: Órdenes de corte con múltiples piezas
- **Geometry**: Formas geométricas (Polígono, Círculo, Óvalo)
- **Optimization**: Resultados de optimización de cortes

## 🐳 Docker

### Desarrollo

```bash
# Construir imagen de desarrollo
docker build -f Dockerfile.dev -t maxicortes-frontend-dev .

# Ejecutar con docker-compose
docker-compose --profile dev up frontend-dev
```

### Producción

```bash
# Construir imagen de producción
docker build -t maxicortes-frontend .

# Ejecutar
docker-compose up frontend
```

## 📊 Métricas de Calidad

### Objetivos

- **Cobertura de tests**: ≥90%
- **Performance**: LCP < 2.5s, FID < 100ms
- **Accesibilidad**: WCAG AA compliance
- **Bundle size**: < 1MB gzipped

### Herramientas

- **Vitest**: Testing framework
- **Playwright**: Tests E2E
- **ESLint**: Linting
- **Prettier**: Formateo de código
- **TypeScript**: Type safety

## 🚀 Deployment

### CI/CD Pipeline

El proyecto incluye GitHub Actions para:

1. **Tests**: Unitarios, integración y E2E
2. **Linting**: ESLint y TypeScript
3. **Build**: Optimización de assets
4. **Docker**: Build y push de imágenes
5. **Deploy**: Automático en main branch

### Ambientes

- **Development**: Auto-deploy desde develop branch
- **Staging**: Auto-deploy desde release branches
- **Production**: Auto-deploy desde main branch

## 📝 Contribución

### Workflow

1. Crear feature branch desde `develop`
2. Escribir tests (TDD)
3. Implementar funcionalidad
4. Verificar cobertura ≥90%
5. Crear Pull Request
6. Code review y merge

### Estándares

- **TDD obligatorio**: Tests antes que código
- **TypeScript estricto**: No `any`, tipos explícitos
- **Arquitectura hexagonal**: Respetar separación de capas
- **Convenciones**: ESLint + Prettier

## 🔧 Troubleshooting

### Problemas Comunes

1. **Tests fallan por memoria**: Ejecutar tests individuales
2. **Build lento**: Verificar cache de Vite
3. **Types errors**: Ejecutar `npm run type-check`

### Logs y Debug

```bash
# Debug de Vite
DEBUG=vite:* npm run dev

# Logs de tests
npm run test -- --reporter=verbose

# Análisis de bundle
npm run build -- --analyze
```

## 📚 Documentación

- [Arquitectura Hexagonal](./docs/architecture.md)
- [Guía de Testing](./docs/testing.md)
- [Componentes UI](./docs/components.md)
- [API Integration](./docs/api.md)

## 📄 Licencia

Este proyecto es privado y confidencial.

---

**MaxiCortes Frontend** - Optimización de cortes de materiales