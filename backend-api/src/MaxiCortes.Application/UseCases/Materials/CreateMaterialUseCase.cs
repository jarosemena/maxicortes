using AutoMapper;
using MaxiCortes.Application.DTOs.Materials;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Application.UseCases.Materials;

public class CreateMaterialUseCase
{
    private readonly IMaterialRepository _materialRepository;
    private readonly IMapper _mapper;

    public CreateMaterialUseCase(IMaterialRepository materialRepository, IMapper mapper)
    {
        _materialRepository = materialRepository ?? throw new ArgumentNullException(nameof(materialRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<MaterialResponse> ExecuteAsync(CreateMaterialRequest request, CancellationToken cancellationToken = default)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        // Validate request
        ValidateRequest(request);

        // Create domain entity
        var material = new Material(
            request.Name,
            MaterialTypeExtensions.FromString(request.Type),
            new Dimensions(request.Dimensions.Width, request.Dimensions.Height, request.Dimensions.Thickness),
            new Money(request.CostPerUnit.Amount, request.CostPerUnit.Currency),
            request.StockQuantity
        );

        // Save to repository
        var savedMaterial = await _materialRepository.AddAsync(material, cancellationToken);

        // Map to response
        return _mapper.Map<MaterialResponse>(savedMaterial);
    }

    private static void ValidateRequest(CreateMaterialRequest request)
    {
        var errors = new List<string>();

        if (string.IsNullOrWhiteSpace(request.Name))
            errors.Add("Material name is required");

        if (string.IsNullOrWhiteSpace(request.Type))
            errors.Add("Material type is required");

        if (request.Dimensions == null)
            errors.Add("Dimensions are required");
        else
        {
            if (request.Dimensions.Width <= 0)
                errors.Add("Width must be positive");
            if (request.Dimensions.Height <= 0)
                errors.Add("Height must be positive");
            if (request.Dimensions.Thickness <= 0)
                errors.Add("Thickness must be positive");
        }

        if (request.CostPerUnit == null)
            errors.Add("Cost per unit is required");
        else if (request.CostPerUnit.Amount < 0)
            errors.Add("Cost per unit cannot be negative");

        if (request.StockQuantity < 0)
            errors.Add("Stock quantity cannot be negative");

        if (errors.Any())
            throw new ArgumentException($"Validation failed: {string.Join(", ", errors)}");
    }
}