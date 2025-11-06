using AutoMapper;
using MaxiCortes.Application.DTOs.Common;
using MaxiCortes.Application.DTOs.Materials;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Application.UseCases.Materials;

public class GetMaterialsUseCase
{
    private readonly IMaterialRepository _materialRepository;
    private readonly IMapper _mapper;

    public GetMaterialsUseCase(IMaterialRepository materialRepository, IMapper mapper)
    {
        _materialRepository = materialRepository ?? throw new ArgumentNullException(nameof(materialRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<PaginatedResponse<MaterialResponse>> ExecuteAsync(
        PaginationRequest pagination,
        MaterialFilterRequest? filter = null,
        CancellationToken cancellationToken = default)
    {
        if (pagination == null)
            throw new ArgumentNullException(nameof(pagination));

        // Validate pagination
        if (pagination.PageNumber < 1)
            pagination.PageNumber = 1;
        if (pagination.PageSize < 1 || pagination.PageSize > 100)
            pagination.PageSize = 10;

        // Parse filter parameters
        MaterialType? materialType = null;
        if (!string.IsNullOrWhiteSpace(filter?.Type))
        {
            try
            {
                materialType = MaterialTypeExtensions.FromString(filter.Type);
            }
            catch
            {
                // Invalid material type, ignore filter
            }
        }

        // Get paginated results
        var (materials, totalCount) = await _materialRepository.GetPagedAsync(
            pagination.Skip,
            pagination.Take,
            filter?.SearchTerm,
            materialType,
            filter?.IsActive,
            filter?.SortBy,
            filter?.SortDescending ?? false,
            cancellationToken);

        // Map to response DTOs
        var materialResponses = _mapper.Map<IEnumerable<MaterialResponse>>(materials);

        return new PaginatedResponse<MaterialResponse>
        {
            Items = materialResponses,
            TotalCount = totalCount,
            PageNumber = pagination.PageNumber,
            PageSize = pagination.PageSize
        };
    }

    public async Task<MaterialResponse?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var material = await _materialRepository.GetByIdAsync(id, cancellationToken);
        return material != null ? _mapper.Map<MaterialResponse>(material) : null;
    }

    public async Task<IEnumerable<MaterialResponse>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        var materials = await _materialRepository.GetActiveAsync(cancellationToken);
        return _mapper.Map<IEnumerable<MaterialResponse>>(materials);
    }
}