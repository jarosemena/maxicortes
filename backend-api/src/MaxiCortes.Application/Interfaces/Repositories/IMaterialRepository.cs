using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Application.Interfaces.Repositories;

public interface IMaterialRepository
{
    Task<Material?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Material>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<IEnumerable<Material>> GetByTypeAsync(MaterialType type, CancellationToken cancellationToken = default);
    Task<IEnumerable<Material>> GetActiveAsync(CancellationToken cancellationToken = default);
    Task<(IEnumerable<Material> Items, int TotalCount)> GetPagedAsync(
        int skip, 
        int take, 
        string? searchTerm = null,
        MaterialType? type = null,
        bool? isActive = null,
        string? sortBy = null,
        bool sortDescending = false,
        CancellationToken cancellationToken = default);
    
    Task<Material> AddAsync(Material material, CancellationToken cancellationToken = default);
    Task<Material> UpdateAsync(Material material, CancellationToken cancellationToken = default);
    Task DeleteAsync(Guid id, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default);
}