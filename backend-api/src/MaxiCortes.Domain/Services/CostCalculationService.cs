using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Domain.Services;

public class CostCalculationService
{
    private const decimal WasteFactorPercentage = 0.15m; // 15% waste factor

    public Money CalculateOrderCost(Order order, IEnumerable<Material> materials)
    {
        if (order == null)
            throw new ArgumentNullException(nameof(order));

        if (!order.Items.Any())
            return new Money(0);

        var materialDict = materials.ToDictionary(m => m.Id, m => m);
        var totalCost = order.Items.First().CalculateItemCost(materialDict[order.Items.First().MaterialId]);

        foreach (var item in order.Items.Skip(1))
        {
            if (materialDict.TryGetValue(item.MaterialId, out var material))
            {
                var itemCost = CalculateItemCost(item, material);
                totalCost = totalCost.Add(itemCost);
            }
        }

        return totalCost;
    }

    public Money CalculateItemCost(OrderItem item, Material material)
    {
        if (item == null)
            throw new ArgumentNullException(nameof(item));
        
        if (material == null)
            throw new ArgumentNullException(nameof(material));

        // Calculate cost based on material usage
        var pieceArea = item.Geometry.CalculateArea();
        var materialArea = material.CalculateArea();
        var usageRatio = pieceArea / materialArea;

        // Apply quantity
        var totalUsageRatio = usageRatio * item.Quantity;

        // Calculate base cost
        var baseCost = material.CostPerUnit.Multiply(totalUsageRatio);

        // Apply priority multiplier
        var priorityMultiplier = GetPriorityMultiplier(item.Priority);
        var finalCost = baseCost.Multiply(priorityMultiplier);

        return finalCost;
    }

    public Money CalculateWasteCost(Order order, IEnumerable<Material> materials, decimal actualWastePercentage = 0)
    {
        if (order == null)
            throw new ArgumentNullException(nameof(order));

        var wastePercentage = actualWastePercentage > 0 ? actualWastePercentage : WasteFactorPercentage;
        var orderCost = CalculateOrderCost(order, materials);
        
        return orderCost.Multiply(wastePercentage);
    }

    public CostBreakdown CalculateDetailedCost(Order order, IEnumerable<Material> materials)
    {
        if (order == null)
            throw new ArgumentNullException(nameof(order));

        var materialDict = materials.ToDictionary(m => m.Id, m => m);
        var itemCosts = new List<ItemCostDetail>();

        foreach (var item in order.Items)
        {
            if (materialDict.TryGetValue(item.MaterialId, out var material))
            {
                var itemCost = CalculateItemCost(item, material);
                var pieceArea = item.Geometry.CalculateArea();
                
                itemCosts.Add(new ItemCostDetail(
                    item.Id,
                    material.Name,
                    item.Quantity,
                    pieceArea,
                    itemCost,
                    item.Priority
                ));
            }
        }

        var subtotal = itemCosts.Aggregate(
            new Money(0), 
            (acc, detail) => acc.Add(detail.Cost)
        );

        var wasteCost = CalculateWasteCost(order, materials);
        var total = subtotal.Add(wasteCost);

        return new CostBreakdown(itemCosts, subtotal, wasteCost, total);
    }

    public decimal CalculateEfficiencyRatio(Order order, IEnumerable<Material> materials)
    {
        if (order == null || !order.Items.Any())
            return 0;

        var materialDict = materials.ToDictionary(m => m.Id, m => m);
        decimal totalUsedArea = 0;
        decimal totalMaterialArea = 0;

        foreach (var item in order.Items)
        {
            if (materialDict.TryGetValue(item.MaterialId, out var material))
            {
                var pieceArea = item.Geometry.CalculateArea() * item.Quantity;
                var materialArea = material.CalculateArea();
                
                totalUsedArea += pieceArea;
                totalMaterialArea += materialArea * item.Quantity;
            }
        }

        return totalMaterialArea > 0 ? totalUsedArea / totalMaterialArea : 0;
    }

    private static decimal GetPriorityMultiplier(Priority priority)
    {
        return priority switch
        {
            Priority.Low => 0.9m,      // 10% discount
            Priority.Normal => 1.0m,   // No change
            Priority.High => 1.1m,     // 10% premium
            Priority.Urgent => 1.25m,  // 25% premium
            _ => 1.0m
        };
    }
}

public static class OrderItemExtensions
{
    public static Money CalculateItemCost(this OrderItem item, Material material)
    {
        var service = new CostCalculationService();
        return service.CalculateItemCost(item, material);
    }
}

public class ItemCostDetail
{
    public Guid ItemId { get; }
    public string MaterialName { get; }
    public int Quantity { get; }
    public decimal PieceArea { get; }
    public Money Cost { get; }
    public Priority Priority { get; }

    public ItemCostDetail(Guid itemId, string materialName, int quantity, decimal pieceArea, Money cost, Priority priority)
    {
        ItemId = itemId;
        MaterialName = materialName;
        Quantity = quantity;
        PieceArea = pieceArea;
        Cost = cost;
        Priority = priority;
    }
}

public class CostBreakdown
{
    public IReadOnlyList<ItemCostDetail> ItemCosts { get; }
    public Money Subtotal { get; }
    public Money WasteCost { get; }
    public Money Total { get; }

    public CostBreakdown(IEnumerable<ItemCostDetail> itemCosts, Money subtotal, Money wasteCost, Money total)
    {
        ItemCosts = itemCosts.ToList().AsReadOnly();
        Subtotal = subtotal;
        WasteCost = wasteCost;
        Total = total;
    }
}