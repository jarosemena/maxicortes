using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Infrastructure.Data.Configurations;

public class MaterialConfiguration : IEntityTypeConfiguration<Material>
{
    public void Configure(EntityTypeBuilder<Material> builder)
    {
        builder.ToTable("Materials");

        builder.HasKey(m => m.Id);

        builder.Property(m => m.Id)
            .ValueGeneratedNever(); // We generate GUIDs in the domain

        builder.Property(m => m.Name)
            .IsRequired()
            .HasMaxLength(200);

        builder.Property(m => m.Type)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(50);

        // Configure Dimensions value object
        builder.OwnsOne(m => m.Dimensions, dimensions =>
        {
            dimensions.Property(d => d.Width)
                .HasColumnName("Width")
                .HasPrecision(10, 2)
                .IsRequired();

            dimensions.Property(d => d.Height)
                .HasColumnName("Height")
                .HasPrecision(10, 2)
                .IsRequired();

            dimensions.Property(d => d.Thickness)
                .HasColumnName("Thickness")
                .HasPrecision(10, 4)
                .IsRequired();
        });

        // Configure Money value object
        builder.OwnsOne(m => m.CostPerUnit, money =>
        {
            money.Property(m => m.Amount)
                .HasColumnName("CostAmount")
                .HasPrecision(18, 2)
                .IsRequired();

            money.Property(m => m.Currency)
                .HasColumnName("CostCurrency")
                .HasMaxLength(3)
                .IsRequired();
        });

        builder.Property(m => m.StockQuantity)
            .IsRequired();

        builder.Property(m => m.IsActive)
            .IsRequired()
            .HasDefaultValue(true);

        builder.Property(m => m.CreatedAt)
            .IsRequired();

        builder.Property(m => m.UpdatedAt)
            .IsRequired();

        // Indexes
        builder.HasIndex(m => m.Name);
        builder.HasIndex(m => m.Type);
        builder.HasIndex(m => m.IsActive);
        builder.HasIndex(m => new { m.Type, m.IsActive });
    }
}