using Microsoft.EntityFrameworkCore;
using MaxiCortes.Domain.Entities;
using MaxiCortes.Infrastructure.Data.Configurations;

namespace MaxiCortes.Infrastructure.Data.Contexts;

public class MaxiCortesDbContext : DbContext
{
    public MaxiCortesDbContext(DbContextOptions<MaxiCortesDbContext> options) : base(options)
    {
    }

    public DbSet<Material> Materials { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderItem> OrderItems { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Apply all configurations
        modelBuilder.ApplyConfiguration(new MaterialConfiguration());
        modelBuilder.ApplyConfiguration(new OrderConfiguration());
        modelBuilder.ApplyConfiguration(new OrderItemConfiguration());

        // Configure schema
        modelBuilder.HasDefaultSchema("maxicortes");
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // This will be overridden by DI configuration
            optionsBuilder.UseNpgsql("Host=localhost;Database=maxicortes;Username=postgres;Password=postgres");
        }
    }
}