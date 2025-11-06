using MaxiCortes.Application.DTOs.Orders;

namespace MaxiCortes.Application.DTOs.Optimization;

public class OptimizationResultResponse
{
    public Guid OrderId { get; set; }
    public List<CutPatternResponse> CutPatterns { get; set; } = new();
    public OptimizationMetricsResponse Metrics { get; set; } = null!;
    public DateTime GeneratedAt { get; set; }
}

public class CutPatternResponse
{
    public Guid Id { get; set; }
    public Guid MaterialId { get; set; }
    public string MaterialName { get; set; } = string.Empty;
    public List<PlacedPieceResponse> PlacedPieces { get; set; } = new();
    public decimal EfficiencyPercentage { get; set; }
    public decimal WasteArea { get; set; }
}

public class PlacedPieceResponse
{
    public Guid OrderItemId { get; set; }
    public GeometryDto Geometry { get; set; } = null!;
    public PointDto Position { get; set; } = null!;
    public decimal Rotation { get; set; }
    public int Quantity { get; set; }
}

public class OptimizationMetricsResponse
{
    public decimal TotalMaterialUsed { get; set; }
    public decimal TotalWasteGenerated { get; set; }
    public decimal OverallEfficiency { get; set; }
    public int TotalSheets { get; set; }
    public TimeSpan OptimizationTime { get; set; }
}

public class OptimizationParametersDto
{
    public bool AllowRotation { get; set; } = true;
    public decimal MinimumWasteThreshold { get; set; } = 0.05m; // 5%
    public int MaxOptimizationTimeSeconds { get; set; } = 300; // 5 minutes
    public string Algorithm { get; set; } = "BottomLeftFill";
}

public class RequestOptimizationRequest
{
    public Guid OrderId { get; set; }
    public OptimizationParametersDto Parameters { get; set; } = new();
}