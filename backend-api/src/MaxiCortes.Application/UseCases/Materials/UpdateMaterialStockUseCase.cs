using AutoMapper;
using MaxiCortes.Application.DTOs.Materials;
using MaxiCortes.Application.Interfaces.Repositories;

namespace MaxiCortes.Application.UseCases.Materials;

public class UpdateMaterialStockUseCase
{
    private readonly IMaterialRepository _materialRepository;
    private readonly IMapper _mapper;

    public UpdateMaterialStockUseCase(IMaterialRepository materialRepository, IMapper mapper)
    {
        _materialRepository = materialRepository ?? throw new ArgumentNullException(nameof(materialRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<MaterialResponse> ExecuteAsync(
        Guid materialId, 
        UpdateMaterialStockRequest request, 
        CancellationToken cancellationToken = default)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        if (materialId == Guid.Empty)
            throw new ArgumentException("Material ID is required", nameof(materialId));

        // Validate request
        if (request.NewQuantity < 0)
            throw new ArgumentException("Stock quantity cannot be negative");

        if (string.IsNullOrWhiteSpace(request.Reason))
            throw new ArgumentException("Reason for stock update is required");

        // Get existing material
        var material = await _materialRepository.GetByIdAsync(materialId, cancellationToken);
        if (material == null)
            throw new InvalidOperationException($"Material with ID {materialId} not found");

        if (!material.IsActive)
            throw new InvalidOperationException("Cannot update stock for inactive material");

        // Update stock
        var previousStock = material.StockQuantity;
        material.UpdateStock(request.NewQuantity);

        // Save changes
        var updatedMaterial = await _materialRepository.UpdateAsync(material, cancellationToken);

        // TODO: Raise MaterialStockUpdated domain event
        // This would be handled by the domain event dispatcher in a real implementation

        return _mapper.Map<MaterialResponse>(updatedMaterial);
    }
}