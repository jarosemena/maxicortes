using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Domain.Interfaces;

public interface IOrderValidationService
{
    ValidationResult ValidateOrder(Order order, IEnumerable<Material> availableMaterials);
    ValidationResult ValidateStock(Order order, IEnumerable<Material> availableMaterials);
    ValidationResult ValidateCustomerLimits(Guid customerId, IEnumerable<Order> customerOrders);
    ValidationResult ValidateGeometry(Geometry geometry, Dimensions materialDimensions);
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