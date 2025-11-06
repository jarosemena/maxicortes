using Microsoft.AspNetCore.Mvc;
using MaxiCortes.Infrastructure.Data.Contexts;

namespace MaxiCortes.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class HealthController : ControllerBase
{
    private readonly MaxiCortesDbContext _dbContext;

    public HealthController(MaxiCortesDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    /// <summary>
    /// Health check endpoint
    /// </summary>
    /// <returns>Health status</returns>
    [HttpGet]
    [ProducesResponseType(typeof(HealthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(HealthResponse), StatusCodes.Status503ServiceUnavailable)]
    public async Task<ActionResult<HealthResponse>> GetHealth()
    {
        var response = new HealthResponse
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Version = GetType().Assembly.GetName().Version?.ToString() ?? "Unknown"
        };

        try
        {
            // Check database connectivity
            var canConnect = await _dbContext.Database.CanConnectAsync();
            response.Database = canConnect ? "Connected" : "Disconnected";
            
            if (!canConnect)
            {
                response.Status = "Unhealthy";
                return StatusCode(StatusCodes.Status503ServiceUnavailable, response);
            }
        }
        catch (Exception ex)
        {
            response.Status = "Unhealthy";
            response.Database = $"Error: {ex.Message}";
            return StatusCode(StatusCodes.Status503ServiceUnavailable, response);
        }

        return Ok(response);
    }

    /// <summary>
    /// Readiness check endpoint
    /// </summary>
    /// <returns>Readiness status</returns>
    [HttpGet("ready")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
    public IActionResult GetReadiness()
    {
        // Add any readiness checks here (e.g., external services)
        return Ok(new { status = "Ready", timestamp = DateTime.UtcNow });
    }

    /// <summary>
    /// Liveness check endpoint
    /// </summary>
    /// <returns>Liveness status</returns>
    [HttpGet("live")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult GetLiveness()
    {
        return Ok(new { status = "Alive", timestamp = DateTime.UtcNow });
    }
}

public class HealthResponse
{
    public string Status { get; set; } = string.Empty;
    public string Database { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Version { get; set; } = string.Empty;
}