using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;
using System.Text.Json;

namespace MaxiCortes.Infrastructure.Data.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems");

        builder.HasKey(oi => oi.Id);

        builder.Property(oi => oi.Id)
            .ValueGeneratedNever(); // We generate GUIDs in the domain

        builder.Property(oi => oi.OrderId)
            .IsRequired();

        builder.Property(oi => oi.MaterialId)
            .IsRequired();

        // Configure Geometry value object as JSON
        builder.Property(oi => oi.Geometry)
            .IsRequired()
            .HasConversion(
                geometry => geometry.ToJson(),
                json => Geometry.FromJson(json))
            .HasColumnType("jsonb");

        builder.Property(oi => oi.Quantity)
            .IsRequired();

        builder.Property(oi => oi.Priority)
            .IsRequired()
            .HasConversion<string>()
            .HasMaxLength(20);

        // Configure Money value object
        builder.OwnsOne(oi => oi.UnitPrice, money =>
        {
            money.Property(m => m.Amount)
                .HasColumnName("UnitPriceAmount")
                .HasPrecision(18, 2)
                .IsRequired();

            money.Property(m => m.Currency)
                .HasColumnName("UnitPriceCurrency")
                .HasMaxLength(3)
                .IsRequired();
        });

        builder.Property(oi => oi.CreatedAt)
            .IsRequired();

        builder.Property(oi => oi.UpdatedAt)
            .IsRequired();

        // Configure relationships
        builder.HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(oi => oi.Material)
            .WithMany()
            .HasForeignKey(oi => oi.MaterialId)
            .OnDelete(DeleteBehavior.Restrict);

        // Indexes
        builder.HasIndex(oi => oi.OrderId);
        builder.HasIndex(oi => oi.MaterialId);
        builder.HasIndex(oi => oi.Priority);
    }
}