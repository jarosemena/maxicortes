# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY ["src/MaxiCortes.WebAPI/MaxiCortes.WebAPI.csproj", "src/MaxiCortes.WebAPI/"]
COPY ["src/MaxiCortes.Application/MaxiCortes.Application.csproj", "src/MaxiCortes.Application/"]
COPY ["src/MaxiCortes.Infrastructure/MaxiCortes.Infrastructure.csproj", "src/MaxiCortes.Infrastructure/"]
COPY ["src/MaxiCortes.Domain/MaxiCortes.Domain.csproj", "src/MaxiCortes.Domain/"]

RUN dotnet restore "src/MaxiCortes.WebAPI/MaxiCortes.WebAPI.csproj"

# Copy source code and build
COPY . .
WORKDIR "/src/src/MaxiCortes.WebAPI"
RUN dotnet build "MaxiCortes.WebAPI.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "MaxiCortes.WebAPI.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 80
EXPOSE 443

COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "MaxiCortes.WebAPI.dll"]