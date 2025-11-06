using Microsoft.EntityFrameworkCore;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;
using MaxiCortes.Infrastructure.Data.Contexts;

namespace MaxiCortes.Infrastructure.Data.Repositories;

public class MaterialRepository : IMaterialRepository
{
    private readonly MaxiCortesDbContext _context;

    public MaterialRepository(MaxiCortesDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public async Task<Material?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Materials
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Material>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Materials
            .OrderBy(m => m.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Material>> GetByTypeAsync(MaterialType type, CancellationToken cancellationToken = default)
    {
        return await _context.Materials
            .Where(m => m.Type == type)
            .OrderBy(m => m.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Material>> GetActiveAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Materials
            .Where(m => m.IsActive)
            .OrderBy(m => m.Name)
            .ToListAsync(cancellationToken);
    }

    public async Task<(IEnumerable<Material> Items, int TotalCount)> GetPagedAsync(
        int skip,
        int take,
        string? searchTerm = null,
        MaterialType? type = null,
        bool? isActive = null,
        string? sortBy = null,
        bool sortDescending = false,
        CancellationToken cancellationToken = default)
    {
        var query = _context.Materials.AsQueryable();

        // Apply filters
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            query = query.Where(m => m.Name.Contains(searchTerm));
        }

        if (type.HasValue)
        {
            query = query.Where(m => m.Type == type.Value);
        }

        if (isActive.HasValue)
        {
            query = query.Where(m => m.IsActive == isActive.Value);
        }

        // Get total count before pagination
        var totalCount = await query.CountAsync(cancellationToken);

        // Apply sorting
        query = ApplySorting(query, sortBy, sortDescending);

        // Apply pagination
        var items = await query
            .Skip(skip)
            .Take(take)
            .ToListAsync(cancellationToken);

        return (items, totalCount);
    }

    public async Task<Material> AddAsync(Material material, CancellationToken cancellationToken = default)
    {
        _context.Materials.Add(material);
        await _context.SaveChangesAsync(cancellationToken);
        return material;
    }

    public async Task<Material> UpdateAsync(Material material, CancellationToken cancellationToken = default)
    {
        _context.Materials.Update(material);
        await _context.SaveChangesAsync(cancellationToken);
        return material;
    }

    public async Task DeleteAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var material = await GetByIdAsync(id, cancellationToken);
        if (material != null)
        {
            _context.Materials.Remove(material);
            await _context.SaveChangesAsync(cancellationToken);
        }
    }

    public async Task<bool> ExistsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Materials
            .AnyAsync(m => m.Id == id, cancellationToken);
    }

    private static IQueryable<Material> ApplySorting(IQueryable<Material> query, string? sortBy, bool sortDescending)
    {
        return sortBy?.ToLowerInvariant() switch
        {
            "name" => sortDescending ? query.OrderByDescending(m => m.Name) : query.OrderBy(m => m.Name),
            "type" => sortDescending ? query.OrderByDescending(m => m.Type) : query.OrderBy(m => m.Type),
            "cost" => sortDescending ? query.OrderByDescending(m => m.CostPerUnit.Amount) : query.OrderBy(m => m.CostPerUnit.Amount),
            "stock" => sortDescending ? query.OrderByDescending(m => m.StockQuantity) : query.OrderBy(m => m.StockQuantity),
            "createdat" => sortDescending ? query.OrderByDescending(m => m.CreatedAt) : query.OrderBy(m => m.CreatedAt),
            _ => query.OrderBy(m => m.Name) // Default sorting
        };
    }
}