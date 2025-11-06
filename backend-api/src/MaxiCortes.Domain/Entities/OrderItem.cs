using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Domain.Entities;

public class OrderItem
{
    public Guid Id { get; private set; }
    public Guid OrderId { get; private set; }
    public Guid MaterialId { get; private set; }
    public Geometry Geometry { get; private set; }
    public int Quantity { get; private set; }
    public Priority Priority { get; private set; }
    public Money UnitPrice { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }

    // Navigation properties
    public Order Order { get; private set; } = null!;
    public Material Material { get; private set; } = null!;

    // Private constructor for EF Core
    private OrderItem() 
    {
        Geometry = null!;
        UnitPrice = null!;
    }

    public OrderItem(
        Guid orderId,
        Guid materialId,
        Geometry geometry,
        int quantity,
        Money unitPrice,
        Priority priority = Priority.Normal)
    {
        if (quantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(quantity));

        Id = Guid.NewGuid();
        OrderId = orderId;
        MaterialId = materialId;
        Geometry = geometry ?? throw new ArgumentNullException(nameof(geometry));
        Quantity = quantity;
        UnitPrice = unitPrice ?? throw new ArgumentNullException(nameof(unitPrice));
        Priority = priority;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateQuantity(int newQuantity)
    {
        if (newQuantity <= 0)
            throw new ArgumentException("Quantity must be positive", nameof(newQuantity));

        Quantity = newQuantity;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdatePriority(Priority newPriority)
    {
        Priority = newPriority;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateUnitPrice(Money newUnitPrice)
    {
        UnitPrice = newUnitPrice ?? throw new ArgumentNullException(nameof(newUnitPrice));
        UpdatedAt = DateTime.UtcNow;
    }

    public Money CalculateSubtotal()
    {
        return UnitPrice.Multiply(Quantity);
    }

    public decimal CalculateTotalArea()
    {
        return Geometry.CalculateArea() * Quantity;
    }

    public bool FitsInMaterial(Material material)
    {
        if (material == null)
            throw new ArgumentNullException(nameof(material));

        return Geometry.FitsInDimensions(material.Dimensions);
    }
}

public enum Priority
{
    Low = 1,
    Normal = 2,
    High = 3,
    Urgent = 4
}