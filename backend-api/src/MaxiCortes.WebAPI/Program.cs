using MaxiCortes.Infrastructure;
using MaxiCortes.Application.Mappers;
using MaxiCortes.WebAPI.Middleware;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/maxicortes-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

// Use Serilog
builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MaxiCortes API",
        Version = "v1",
        Description = "API for MaxiCortes cutting optimization system",
        Contact = new OpenApiContact
        {
            Name = "MaxiCortes Team",
            Email = "support@maxicortes.com"
        }
    });

    // Include XML comments
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// Add AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Add Infrastructure services
builder.Services.AddInfrastructure(builder.Configuration);

// Add Use Cases
builder.Services.AddScoped<MaxiCortes.Application.UseCases.Materials.CreateMaterialUseCase>();
builder.Services.AddScoped<MaxiCortes.Application.UseCases.Materials.GetMaterialsUseCase>();
builder.Services.AddScoped<MaxiCortes.Application.UseCases.Materials.UpdateMaterialStockUseCase>();
builder.Services.AddScoped<MaxiCortes.Application.UseCases.Orders.CreateOrderUseCase>();
builder.Services.AddScoped<MaxiCortes.Application.UseCases.Orders.GetOrderDetailsUseCase>();
builder.Services.AddScoped<MaxiCortes.Application.UseCases.Orders.CancelOrderUseCase>();
builder.Services.AddScoped<MaxiCortes.Application.UseCases.Optimization.RequestOptimizationUseCase>();
builder.Services.AddScoped<MaxiCortes.Application.UseCases.Optimization.GetOptimizationResultsUseCase>();

var app = builder.Build();

// Initialize database
await DependencyInjection.InitializeDatabaseAsync(app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MaxiCortes API v1");
        c.RoutePrefix = string.Empty; // Serve Swagger UI at root
    });
}

// Add global exception handling
app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseHttpsRedirection();
app.MapControllers();

app.Run();
