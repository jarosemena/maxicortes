namespace MaxiCortes.Domain.Events;

public class MaterialStockUpdated : DomainEvent
{
    public Guid MaterialId { get; }
    public int PreviousStock { get; }
    public int NewStock { get; }
    public string Reason { get; }

    public MaterialStockUpdated(Guid materialId, int previousStock, int newStock, string reason)
    {
        MaterialId = materialId;
        PreviousStock = previousStock;
        NewStock = newStock;
        Reason = reason;
    }
}

public class MaterialCreated : DomainEvent
{
    public Guid MaterialId { get; }
    public string MaterialName { get; }
    public string MaterialType { get; }

    public MaterialCreated(Guid materialId, string materialName, string materialType)
    {
        MaterialId = materialId;
        MaterialName = materialName;
        MaterialType = materialType;
    }
}

public class MaterialDeactivated : DomainEvent
{
    public Guid MaterialId { get; }
    public string Reason { get; }

    public MaterialDeactivated(Guid materialId, string reason)
    {
        MaterialId = materialId;
        Reason = reason;
    }
}

public class OptimizationRequested : DomainEvent
{
    public Guid OrderId { get; }
    public List<Guid> MaterialIds { get; }
    public int TotalPieces { get; }

    public OptimizationRequested(Guid orderId, List<Guid> materialIds, int totalPieces)
    {
        OrderId = orderId;
        MaterialIds = materialIds ?? new List<Guid>();
        TotalPieces = totalPieces;
    }
}