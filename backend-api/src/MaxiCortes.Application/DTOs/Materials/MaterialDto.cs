namespace MaxiCortes.Application.DTOs.Materials;

public class MaterialResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DimensionsDto Dimensions { get; set; } = null!;
    public MoneyDto CostPerUnit { get; set; } = null!;
    public int StockQuantity { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateMaterialRequest
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public DimensionsDto Dimensions { get; set; } = null!;
    public MoneyDto CostPerUnit { get; set; } = null!;
    public int StockQuantity { get; set; } = 0;
}

public class UpdateMaterialRequest
{
    public string? Name { get; set; }
    public DimensionsDto? Dimensions { get; set; }
    public MoneyDto? CostPerUnit { get; set; }
    public int? StockQuantity { get; set; }
    public bool? IsActive { get; set; }
}

public class UpdateMaterialStockRequest
{
    public int NewQuantity { get; set; }
    public string Reason { get; set; } = string.Empty;
}

public class MaterialFilterRequest
{
    public string? Type { get; set; }
    public bool? IsActive { get; set; }
    public string? SearchTerm { get; set; }
    public string? SortBy { get; set; } = "Name";
    public bool SortDescending { get; set; } = false;
}

public class DimensionsDto
{
    public decimal Width { get; set; }
    public decimal Height { get; set; }
    public decimal Thickness { get; set; }
}

public class MoneyDto
{
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "USD";
}