using MaxiCortes.Application.DTOs.Optimization;
using MaxiCortes.Application.DTOs.Orders;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Application.Interfaces.Services;

namespace MaxiCortes.Infrastructure.ExternalServices.OptimizationEngine;

public class MockOptimizationService : IOptimizationService
{
    private readonly IOrderRepository _orderRepository;
    private readonly Dictionary<Guid, OptimizationResultResponse> _cachedResults = new();

    public MockOptimizationService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
    }

    public async Task<OptimizationResultResponse> OptimizeOrderAsync(
        Guid orderId,
        OptimizationParametersDto parameters,
        CancellationToken cancellationToken = default)
    {
        // Get order details
        var order = await _orderRepository.GetByIdAsync(orderId, cancellationToken);
        if (order == null)
            throw new InvalidOperationException($"Order {orderId} not found");

        // Simulate processing time
        await Task.Delay(Random.Shared.Next(1000, 3000), cancellationToken);

        // Generate mock optimization result
        var result = GenerateMockResult(order, parameters);
        
        // Cache the result
        _cachedResults[orderId] = result;

        return result;
    }

    public Task<OptimizationResultResponse?> GetOptimizationResultAsync(
        Guid orderId,
        CancellationToken cancellationToken = default)
    {
        _cachedResults.TryGetValue(orderId, out var result);
        return Task.FromResult(result);
    }

    private static OptimizationResultResponse GenerateMockResult(
        Domain.Entities.Order order,
        OptimizationParametersDto parameters)
    {
        var cutPatterns = new List<CutPatternResponse>();
        var random = new Random();

        // Group items by material
        var materialGroups = order.Items.GroupBy(i => i.MaterialId);

        foreach (var materialGroup in materialGroups)
        {
            var material = materialGroup.First().Material;
            var placedPieces = new List<PlacedPieceResponse>();

            foreach (var item in materialGroup)
            {
                // Generate random positions for pieces
                for (int i = 0; i < item.Quantity; i++)
                {
                    placedPieces.Add(new PlacedPieceResponse
                    {
                        OrderItemId = item.Id,
                        Geometry = MapGeometryToDto(item.Geometry),
                        Position = new PointDto
                        {
                            X = random.Next(0, (int)material.Dimensions.Width / 2),
                            Y = random.Next(0, (int)material.Dimensions.Height / 2)
                        },
                        Rotation = parameters.AllowRotation ? random.Next(0, 360) : 0,
                        Quantity = 1
                    });
                }
            }

            // Calculate mock efficiency
            var totalPieceArea = materialGroup.Sum(i => i.CalculateTotalArea());
            var materialArea = material.CalculateArea();
            var efficiency = Math.Min(0.95m, totalPieceArea / materialArea);

            cutPatterns.Add(new CutPatternResponse
            {
                Id = Guid.NewGuid(),
                MaterialId = material.Id,
                MaterialName = material.Name,
                PlacedPieces = placedPieces,
                EfficiencyPercentage = efficiency * 100,
                WasteArea = materialArea * (1 - efficiency)
            });
        }

        var totalMaterialUsed = cutPatterns.Sum(cp => cp.PlacedPieces.Count);
        var totalWaste = cutPatterns.Sum(cp => cp.WasteArea);
        var overallEfficiency = cutPatterns.Average(cp => cp.EfficiencyPercentage);

        return new OptimizationResultResponse
        {
            OrderId = order.Id,
            CutPatterns = cutPatterns,
            Metrics = new OptimizationMetricsResponse
            {
                TotalMaterialUsed = totalMaterialUsed,
                TotalWasteGenerated = totalWaste,
                OverallEfficiency = overallEfficiency,
                TotalSheets = cutPatterns.Count,
                OptimizationTime = TimeSpan.FromSeconds(random.Next(5, 30))
            },
            GeneratedAt = DateTime.UtcNow
        };
    }

    private static GeometryDto MapGeometryToDto(Domain.ValueObjects.Geometry geometry)
    {
        return geometry switch
        {
            Domain.ValueObjects.Circle circle => new CircleDto
            {
                Center = new PointDto { X = circle.Center.X, Y = circle.Center.Y },
                Radius = circle.Radius
            },
            Domain.ValueObjects.Oval oval => new OvalDto
            {
                Center = new PointDto { X = oval.Center.X, Y = oval.Center.Y },
                RadiusX = oval.RadiusX,
                RadiusY = oval.RadiusY
            },
            Domain.ValueObjects.Polygon polygon => new PolygonDto
            {
                Points = polygon.Points.Select(p => new PointDto { X = p.X, Y = p.Y }).ToList()
            },
            _ => throw new ArgumentException($"Unknown geometry type: {geometry.GetType()}")
        };
    }
}