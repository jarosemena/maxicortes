using Microsoft.AspNetCore.Mvc;
using MaxiCortes.Application.DTOs.Common;
using MaxiCortes.Application.DTOs.Materials;
using MaxiCortes.Application.UseCases.Materials;

namespace MaxiCortes.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class MaterialsController : ControllerBase
{
    private readonly CreateMaterialUseCase _createMaterialUseCase;
    private readonly GetMaterialsUseCase _getMaterialsUseCase;
    private readonly UpdateMaterialStockUseCase _updateMaterialStockUseCase;

    public MaterialsController(
        CreateMaterialUseCase createMaterialUseCase,
        GetMaterialsUseCase getMaterialsUseCase,
        UpdateMaterialStockUseCase updateMaterialStockUseCase)
    {
        _createMaterialUseCase = createMaterialUseCase;
        _getMaterialsUseCase = getMaterialsUseCase;
        _updateMaterialStockUseCase = updateMaterialStockUseCase;
    }

    /// <summary>
    /// Get all materials with pagination and filtering
    /// </summary>
    /// <param name="pageNumber">Page number (default: 1)</param>
    /// <param name="pageSize">Page size (default: 10, max: 100)</param>
    /// <param name="type">Filter by material type</param>
    /// <param name="isActive">Filter by active status</param>
    /// <param name="searchTerm">Search in material names</param>
    /// <param name="sortBy">Sort field (Name, Type, Cost, Stock, CreatedAt)</param>
    /// <param name="sortDescending">Sort direction</param>
    /// <returns>Paginated list of materials</returns>
    [HttpGet]
    [ProducesResponseType(typeof(PaginatedResponse<MaterialResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PaginatedResponse<MaterialResponse>>> GetMaterials(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10,
        [FromQuery] string? type = null,
        [FromQuery] bool? isActive = null,
        [FromQuery] string? searchTerm = null,
        [FromQuery] string? sortBy = "Name",
        [FromQuery] bool sortDescending = false,
        CancellationToken cancellationToken = default)
    {
        var pagination = new PaginationRequest
        {
            PageNumber = pageNumber,
            PageSize = Math.Min(pageSize, 100) // Limit max page size
        };

        var filter = new MaterialFilterRequest
        {
            Type = type,
            IsActive = isActive,
            SearchTerm = searchTerm,
            SortBy = sortBy,
            SortDescending = sortDescending
        };

        var result = await _getMaterialsUseCase.ExecuteAsync(pagination, filter, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Get material by ID
    /// </summary>
    /// <param name="id">Material ID</param>
    /// <returns>Material details</returns>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(MaterialResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MaterialResponse>> GetMaterial(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var material = await _getMaterialsUseCase.GetByIdAsync(id, cancellationToken);
        
        if (material == null)
            return NotFound($"Material with ID {id} not found");

        return Ok(material);
    }

    /// <summary>
    /// Get all active materials
    /// </summary>
    /// <returns>List of active materials</returns>
    [HttpGet("active")]
    [ProducesResponseType(typeof(IEnumerable<MaterialResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<MaterialResponse>>> GetActiveMaterials(
        CancellationToken cancellationToken = default)
    {
        var materials = await _getMaterialsUseCase.GetActiveAsync(cancellationToken);
        return Ok(materials);
    }

    /// <summary>
    /// Create a new material
    /// </summary>
    /// <param name="request">Material creation data</param>
    /// <returns>Created material</returns>
    [HttpPost]
    [ProducesResponseType(typeof(MaterialResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<MaterialResponse>> CreateMaterial(
        [FromBody] CreateMaterialRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var material = await _createMaterialUseCase.ExecuteAsync(request, cancellationToken);
            return CreatedAtAction(
                nameof(GetMaterial),
                new { id = material.Id },
                material);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Update material stock
    /// </summary>
    /// <param name="id">Material ID</param>
    /// <param name="request">Stock update data</param>
    /// <returns>Updated material</returns>
    [HttpPatch("{id:guid}/stock")]
    [ProducesResponseType(typeof(MaterialResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<MaterialResponse>> UpdateMaterialStock(
        Guid id,
        [FromBody] UpdateMaterialStockRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var material = await _updateMaterialStockUseCase.ExecuteAsync(id, request, cancellationToken);
            return Ok(material);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(new { error = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}