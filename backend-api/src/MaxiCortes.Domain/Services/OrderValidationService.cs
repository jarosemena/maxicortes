using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Domain.Services;

public class OrderValidationService
{
    private const int MaxPendingOrdersPerCustomer = 5;

    public ValidationResult ValidateOrder(Order order, IEnumerable<Material> availableMaterials)
    {
        if (order == null)
            throw new ArgumentNullException(nameof(order));

        var errors = new List<string>();

        // Validate order has items
        if (!order.Items.Any())
        {
            errors.Add("Order must have at least one item");
        }

        // Validate each item
        foreach (var item in order.Items)
        {
            var itemErrors = ValidateOrderItem(item, availableMaterials);
            errors.AddRange(itemErrors);
        }

        return new ValidationResult(errors.Count == 0, errors);
    }

    public ValidationResult ValidateStock(Order order, IEnumerable<Material> availableMaterials)
    {
        if (order == null)
            throw new ArgumentNullException(nameof(order));

        var errors = new List<string>();
        var materialDict = availableMaterials.ToDictionary(m => m.Id, m => m);

        foreach (var item in order.Items)
        {
            if (!materialDict.TryGetValue(item.MaterialId, out var material))
            {
                errors.Add($"Material {item.MaterialId} not found");
                continue;
            }

            if (!material.HasSufficientStock(item.Quantity))
            {
                errors.Add($"Insufficient stock for material {material.Name}. Required: {item.Quantity}, Available: {material.StockQuantity}");
            }
        }

        return new ValidationResult(errors.Count == 0, errors);
    }

    public ValidationResult ValidateCustomerLimits(Guid customerId, IEnumerable<Order> customerOrders)
    {
        var errors = new List<string>();

        var pendingOrders = customerOrders.Count(o => 
            o.Status == OrderStatus.Draft || 
            o.Status == OrderStatus.Pending || 
            o.Status == OrderStatus.Approved);

        if (pendingOrders >= MaxPendingOrdersPerCustomer)
        {
            errors.Add($"Customer has reached the maximum limit of {MaxPendingOrdersPerCustomer} pending orders");
        }

        return new ValidationResult(errors.Count == 0, errors);
    }

    public ValidationResult ValidateGeometry(Geometry geometry, Dimensions materialDimensions)
    {
        if (geometry == null)
            throw new ArgumentNullException(nameof(geometry));

        if (materialDimensions == null)
            throw new ArgumentNullException(nameof(materialDimensions));

        var errors = new List<string>();

        // Validate geometry fits in material dimensions
        if (!geometry.FitsInDimensions(materialDimensions))
        {
            errors.Add($"Geometry does not fit in material dimensions {materialDimensions}");
        }

        // Validate geometry area is positive
        var area = geometry.CalculateArea();
        if (area <= 0)
        {
            errors.Add("Geometry area must be positive");
        }

        // Additional validation based on geometry type
        switch (geometry)
        {
            case Polygon polygon:
                if (polygon.Points.Count < 3)
                {
                    errors.Add("Polygon must have at least 3 points");
                }
                break;

            case Circle circle:
                if (circle.Radius <= 0)
                {
                    errors.Add("Circle radius must be positive");
                }
                break;

            case Oval oval:
                if (oval.RadiusX <= 0 || oval.RadiusY <= 0)
                {
                    errors.Add("Oval radii must be positive");
                }
                break;
        }

        return new ValidationResult(errors.Count == 0, errors);
    }

    private List<string> ValidateOrderItem(OrderItem item, IEnumerable<Material> availableMaterials)
    {
        var errors = new List<string>();
        var material = availableMaterials.FirstOrDefault(m => m.Id == item.MaterialId);

        if (material == null)
        {
            errors.Add($"Material {item.MaterialId} not found");
            return errors;
        }

        if (!material.IsActive)
        {
            errors.Add($"Material {material.Name} is not active");
        }

        if (item.Quantity <= 0)
        {
            errors.Add($"Item quantity must be positive for material {material.Name}");
        }

        // Validate geometry fits in material
        var geometryValidation = ValidateGeometry(item.Geometry, material.Dimensions);
        if (!geometryValidation.IsValid)
        {
            errors.AddRange(geometryValidation.Errors.Select(e => $"Material {material.Name}: {e}"));
        }

        return errors;
    }
}

public class ValidationResult
{
    public bool IsValid { get; }
    public IReadOnlyList<string> Errors { get; }

    public ValidationResult(bool isValid, IEnumerable<string> errors)
    {
        IsValid = isValid;
        Errors = (errors ?? Enumerable.Empty<string>()).ToList().AsReadOnly();
    }
}