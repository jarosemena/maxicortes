# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/MaxiCortes.Domain/MaxiCortes.Domain.csproj", "src/MaxiCortes.Domain/"]
COPY ["src/MaxiCortes.Application/MaxiCortes.Application.csproj", "src/MaxiCortes.Application/"]
COPY ["src/MaxiCortes.Infrastructure/MaxiCortes.Infrastructure.csproj", "src/MaxiCortes.Infrastructure/"]
COPY ["src/MaxiCortes.WebAPI/MaxiCortes.WebAPI.csproj", "src/MaxiCortes.WebAPI/"]

RUN dotnet restore "src/MaxiCortes.WebAPI/MaxiCortes.WebAPI.csproj"

# Copy all source files
COPY . .

# Build the application
WORKDIR "/src/src/MaxiCortes.WebAPI"
RUN dotnet build "MaxiCortes.WebAPI.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "MaxiCortes.WebAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

ENTRYPOINT ["dotnet", "MaxiCortes.WebAPI.dll"]
