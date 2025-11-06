using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Domain.Entities;

public class Material
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public MaterialType Type { get; private set; }
    public Dimensions Dimensions { get; private set; }
    public Money CostPerUnit { get; private set; }
    public int StockQuantity { get; private set; }
    public bool IsActive { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    // Private constructor for EF Core
    private Material() 
    {
        Name = string.Empty;
        Dimensions = null!;
        CostPerUnit = null!;
    }

    public Material(
        string name,
        MaterialType type,
        Dimensions dimensions,
        Money costPerUnit,
        int stockQuantity = 0)
    {
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Material name cannot be empty", nameof(name));

        if (stockQuantity < 0)
            throw new ArgumentException("Stock quantity cannot be negative", nameof(stockQuantity));

        Id = Guid.NewGuid();
        Name = name.Trim();
        Type = type;
        Dimensions = dimensions ?? throw new ArgumentNullException(nameof(dimensions));
        CostPerUnit = costPerUnit ?? throw new ArgumentNullException(nameof(costPerUnit));
        StockQuantity = stockQuantity;
        IsActive = true;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateStock(int newQuantity)
    {
        if (newQuantity < 0)
            throw new ArgumentException("Stock quantity cannot be negative", nameof(newQuantity));

        StockQuantity = newQuantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateCost(Money newCost)
    {
        CostPerUnit = newCost ?? throw new ArgumentNullException(nameof(newCost));
        UpdatedAt = DateTime.UtcNow;
    }

    public void Deactivate()
    {
        IsActive = false;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Activate()
    {
        IsActive = true;
        UpdatedAt = DateTime.UtcNow;
    }

    public bool HasSufficientStock(int requiredQuantity)
    {
        return IsActive && StockQuantity >= requiredQuantity;
    }

    public decimal CalculateArea()
    {
        return Dimensions.Width * Dimensions.Height;
    }
}