# MaxiCortes Backend API

.NET 8 Web API following Clean Architecture principles for the MaxiCortes cutting optimization system.

## Architecture

The project follows Clean Architecture (Hexagonal Architecture) with the following layers:

- **Domain**: Core business logic, entities, value objects, and domain services
- **Application**: Use cases, DTOs, interfaces, and application services
- **Infrastructure**: Data access, external services, and cross-cutting concerns
- **WebAPI**: Controllers, middleware, and presentation layer

## Project Structure

```
src/
├── MaxiCortes.Domain/          # Core business logic
├── MaxiCortes.Application/     # Use cases and DTOs
├── MaxiCortes.Infrastructure/  # Data access and external services
└── MaxiCortes.WebAPI/         # API controllers and configuration

tests/
├── MaxiCortes.Domain.Tests/
├── MaxiCortes.Application.Tests/
├── MaxiCortes.Infrastructure.Tests/
└── MaxiCortes.WebAPI.Tests/
```

## Technologies

- **.NET 8**: Latest LTS version
- **Entity Framework Core**: ORM with PostgreSQL provider
- **AutoMapper**: Object-to-object mapping
- **Swagger/OpenAPI**: API documentation
- **xUnit + FluentAssertions**: Testing framework
- **Docker**: Containerization

## Getting Started

### Prerequisites

- .NET 8 SDK
- Docker and Docker Compose
- PostgreSQL (via Docker)

### Development Setup

1. **Clone and navigate to backend directory**
   ```bash
   cd maxicortes/backend-api
   ```

2. **Start infrastructure services**
   ```bash
   docker-compose up -d postgres redis
   ```

3. **Run database migrations**
   ```bash
   dotnet ef database update --project src/MaxiCortes.Infrastructure --startup-project src/MaxiCortes.WebAPI
   ```

4. **Run the application**
   ```bash
   dotnet run --project src/MaxiCortes.WebAPI
   ```

5. **Access Swagger UI**
   ```
   https://localhost:7000/swagger
   ```

### Docker Development

Run the entire stack with Docker:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- Redis cache (port 6379)
- Backend API (port 5000)

## Development Commands

### Build and Test

```bash
# Build solution
dotnet build

# Run all tests
dotnet test

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"

# Run specific test project
dotnet test tests/MaxiCortes.Domain.Tests/
```

### Database Operations

```bash
# Add new migration
dotnet ef migrations add MigrationName --project src/MaxiCortes.Infrastructure --startup-project src/MaxiCortes.WebAPI

# Update database
dotnet ef database update --project src/MaxiCortes.Infrastructure --startup-project src/MaxiCortes.WebAPI

# Rollback migration
dotnet ef database update PreviousMigrationName --project src/MaxiCortes.Infrastructure --startup-project src/MaxiCortes.WebAPI
```

## API Endpoints

The API provides the following main endpoints:

- **Materials**: `/api/materials` - Material catalog management
- **Orders**: `/api/orders` - Order creation and management
- **Optimization**: `/api/optimization` - Cutting optimization requests

## Configuration

Key configuration settings in `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=maxicortes;Username=maxicortes;Password=maxicortes123",
    "Redis": "localhost:6379"
  },
  "OptimizationEngine": {
    "BaseUrl": "http://localhost:8000",
    "TimeoutSeconds": 120
  }
}
```

## Development Status

This project is currently in development. See [TASKS.md](TASKS.md) for detailed development plan and progress tracking.

### Completed Tasks
- ✅ T001: Initial project setup and Clean Architecture structure
- ✅ Basic Docker configuration
- ✅ NuGet packages configuration

### Next Steps
- Database design and Entity Framework setup
- Domain entities implementation (TDD)
- Use cases implementation
- API controllers development

## Contributing

1. Follow TDD practices - write tests first
2. Maintain ≥90% test coverage
3. Use conventional commit messages
4. Follow Clean Architecture principles
5. Update documentation for new features