using MaxiCortes.Domain.ValueObjects;
using MaxiCortes.Domain.Events;

namespace MaxiCortes.Domain.Entities;

public class Order
{
    private readonly List<OrderItem> _items = new();
    
    public Guid Id { get; private set; }
    public string OrderNumber { get; private set; }
    public Guid CustomerId { get; private set; }
    public OrderStatus Status { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public DateTime UpdatedAt { get; private set; }
    public IReadOnlyList<OrderItem> Items => _items.AsReadOnly();

    // Private constructor for EF Core
    private Order() 
    {
        OrderNumber = string.Empty;
    }

    public Order(Guid customerId, string? orderNumber = null)
    {
        Id = Guid.NewGuid();
        CustomerId = customerId;
        OrderNumber = orderNumber ?? GenerateOrderNumber();
        Status = OrderStatus.Draft;
        CreatedAt = DateTime.UtcNow;
        UpdatedAt = DateTime.UtcNow;
    }

    public void AddItem(OrderItem item)
    {
        if (item == null)
            throw new ArgumentNullException(nameof(item));

        if (Status != OrderStatus.Draft)
            throw new InvalidOperationException("Cannot add items to a non-draft order");

        // Check if item with same material already exists
        var existingItem = _items.FirstOrDefault(i => i.MaterialId == item.MaterialId);
        if (existingItem != null)
        {
            existingItem.UpdateQuantity(existingItem.Quantity + item.Quantity);
        }
        else
        {
            _items.Add(item);
        }

        UpdatedAt = DateTime.UtcNow;
    }

    public void RemoveItem(Guid itemId)
    {
        if (Status != OrderStatus.Draft)
            throw new InvalidOperationException("Cannot remove items from a non-draft order");

        var item = _items.FirstOrDefault(i => i.Id == itemId);
        if (item != null)
        {
            _items.Remove(item);
            UpdatedAt = DateTime.UtcNow;
        }
    }

    public Money CalculateTotal()
    {
        if (!_items.Any())
            return new Money(0);

        var total = _items.First().CalculateSubtotal();
        foreach (var item in _items.Skip(1))
        {
            total = total.Add(item.CalculateSubtotal());
        }

        return total;
    }

    public bool CanCancel()
    {
        return Status == OrderStatus.Draft || Status == OrderStatus.Pending;
    }

    public void Cancel()
    {
        if (!CanCancel())
            throw new InvalidOperationException($"Cannot cancel order in {Status} status");

        Status = OrderStatus.Cancelled;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Submit()
    {
        if (Status != OrderStatus.Draft)
            throw new InvalidOperationException("Only draft orders can be submitted");

        if (!_items.Any())
            throw new InvalidOperationException("Cannot submit order without items");

        Status = OrderStatus.Pending;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Approve()
    {
        if (Status != OrderStatus.Pending)
            throw new InvalidOperationException("Only pending orders can be approved");

        Status = OrderStatus.Approved;
        UpdatedAt = DateTime.UtcNow;
    }

    public void Complete()
    {
        if (Status != OrderStatus.Approved)
            throw new InvalidOperationException("Only approved orders can be completed");

        Status = OrderStatus.Completed;
        UpdatedAt = DateTime.UtcNow;
    }

    public int GetTotalItemCount()
    {
        return _items.Sum(i => i.Quantity);
    }

    public bool HasMaterial(Guid materialId)
    {
        return _items.Any(i => i.MaterialId == materialId);
    }

    private static string GenerateOrderNumber()
    {
        return $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";
    }
}

public enum OrderStatus
{
    Draft = 1,
    Pending = 2,
    Approved = 3,
    InProgress = 4,
    Completed = 5,
    Cancelled = 6
}