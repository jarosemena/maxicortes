using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Application.Interfaces.Services;
using MaxiCortes.Domain.Interfaces;
using MaxiCortes.Domain.Services;
using MaxiCortes.Infrastructure.Data.Contexts;
using MaxiCortes.Infrastructure.Data.Repositories;
using MaxiCortes.Infrastructure.ExternalServices.OptimizationEngine;

namespace MaxiCortes.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration)
    {
        // Database
        services.AddDbContext<MaxiCortesDbContext>(options =>
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            options.UseNpgsql(connectionString);
        });

        // Repositories
        services.AddScoped<IMaterialRepository, MaterialRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();

        // Domain Services
        services.AddScoped<IOrderValidationService, OrderValidationService>();
        services.AddScoped<CostCalculationService>();

        // External Services
        AddOptimizationService(services, configuration);

        return services;
    }

    private static void AddOptimizationService(IServiceCollection services, IConfiguration configuration)
    {
        var useRealOptimizationService = configuration.GetValue<bool>("OptimizationService:UseRealService");

        if (useRealOptimizationService)
        {
            // Configure HttpClient for real optimization service
            services.AddHttpClient<OptimizationService>(client =>
            {
                var baseUrl = configuration.GetValue<string>("OptimizationService:BaseUrl") ?? "http://localhost:8000";
                client.BaseAddress = new Uri(baseUrl);
                client.Timeout = TimeSpan.FromSeconds(configuration.GetValue<int>("OptimizationService:TimeoutSeconds", 300));
            });

            services.Configure<OptimizationServiceOptions>(options =>
            {
                options.BaseUrl = configuration.GetValue<string>("OptimizationService:BaseUrl") ?? "http://localhost:8000";
                options.TimeoutSeconds = configuration.GetValue<int>("OptimizationService:TimeoutSeconds", 300);
            });

            services.AddScoped<IOptimizationService, OptimizationService>();
        }
        else
        {
            // Use mock service for development
            services.AddScoped<IOptimizationService, MockOptimizationService>();
        }
    }

    public static async Task InitializeDatabaseAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<MaxiCortesDbContext>();
        
        try
        {
            await context.Database.MigrateAsync();
        }
        catch (Exception ex)
        {
            // Log the exception in a real application
            throw new InvalidOperationException("Failed to initialize database", ex);
        }
    }
}