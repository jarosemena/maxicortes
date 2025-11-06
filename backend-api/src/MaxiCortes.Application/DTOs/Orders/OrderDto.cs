using MaxiCortes.Application.DTOs.Materials;

namespace MaxiCortes.Application.DTOs.Orders;

public class OrderResponse
{
    public Guid Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public Guid CustomerId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public List<OrderItemResponse> Items { get; set; } = new();
    public MoneyDto Total { get; set; } = null!;
    public int TotalItemCount { get; set; }
}

public class OrderItemResponse
{
    public Guid Id { get; set; }
    public Guid MaterialId { get; set; }
    public string MaterialName { get; set; } = string.Empty;
    public GeometryDto Geometry { get; set; } = null!;
    public int Quantity { get; set; }
    public string Priority { get; set; } = string.Empty;
    public MoneyDto UnitPrice { get; set; } = null!;
    public MoneyDto Subtotal { get; set; } = null!;
    public decimal TotalArea { get; set; }
}

public class CreateOrderRequest
{
    public Guid CustomerId { get; set; }
    public string? OrderNumber { get; set; }
    public List<CreateOrderItemRequest> Items { get; set; } = new();
}

public class CreateOrderItemRequest
{
    public Guid MaterialId { get; set; }
    public GeometryDto Geometry { get; set; } = null!;
    public int Quantity { get; set; }
    public string Priority { get; set; } = "Normal";
}

public class UpdateOrderRequest
{
    public List<UpdateOrderItemRequest>? Items { get; set; }
}

public class UpdateOrderItemRequest
{
    public Guid? Id { get; set; } // null for new items
    public Guid MaterialId { get; set; }
    public GeometryDto Geometry { get; set; } = null!;
    public int Quantity { get; set; }
    public string Priority { get; set; } = "Normal";
}

public class OrderFilterRequest
{
    public Guid? CustomerId { get; set; }
    public string? Status { get; set; }
    public DateTime? CreatedFrom { get; set; }
    public DateTime? CreatedTo { get; set; }
    public string? SearchTerm { get; set; }
    public string? SortBy { get; set; } = "CreatedAt";
    public bool SortDescending { get; set; } = true;
}