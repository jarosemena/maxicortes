using Microsoft.AspNetCore.Mvc;
using MaxiCortes.Application.DTOs.Optimization;
using MaxiCortes.Application.UseCases.Optimization;

namespace MaxiCortes.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class OptimizationController : ControllerBase
{
    private readonly RequestOptimizationUseCase _requestOptimizationUseCase;
    private readonly GetOptimizationResultsUseCase _getOptimizationResultsUseCase;

    public OptimizationController(
        RequestOptimizationUseCase requestOptimizationUseCase,
        GetOptimizationResultsUseCase getOptimizationResultsUseCase)
    {
        _requestOptimizationUseCase = requestOptimizationUseCase;
        _getOptimizationResultsUseCase = getOptimizationResultsUseCase;
    }

    /// <summary>
    /// Request optimization for an order
    /// </summary>
    /// <param name="request">Optimization request with parameters</param>
    /// <returns>Optimization results</returns>
    [HttpPost("optimize")]
    [ProducesResponseType(typeof(OptimizationResultResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status408RequestTimeout)]
    public async Task<ActionResult<OptimizationResultResponse>> RequestOptimization(
        [FromBody] RequestOptimizationRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _requestOptimizationUseCase.ExecuteAsync(request, cancellationToken);
            return Ok(result);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("timed out"))
        {
            return StatusCode(StatusCodes.Status408RequestTimeout, new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (OperationCanceledException)
        {
            return StatusCode(StatusCodes.Status408RequestTimeout, new { error = "Optimization request was cancelled" });
        }
    }

    /// <summary>
    /// Get optimization results for an order
    /// </summary>
    /// <param name="orderId">Order ID</param>
    /// <returns>Optimization results if available</returns>
    [HttpGet("results/{orderId:guid}")]
    [ProducesResponseType(typeof(OptimizationResultResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OptimizationResultResponse>> GetOptimizationResults(
        Guid orderId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var result = await _getOptimizationResultsUseCase.ExecuteAsync(orderId, cancellationToken);
            
            if (result == null)
                return NotFound($"No optimization results found for order {orderId}");

            return Ok(result);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Get optimization metrics for an order
    /// </summary>
    /// <param name="orderId">Order ID</param>
    /// <returns>Optimization metrics if available</returns>
    [HttpGet("metrics/{orderId:guid}")]
    [ProducesResponseType(typeof(OptimizationMetricsResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OptimizationMetricsResponse>> GetOptimizationMetrics(
        Guid orderId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var metrics = await _getOptimizationResultsUseCase.GetOptimizationMetricsAsync(orderId, cancellationToken);
            
            if (metrics == null)
                return NotFound($"No optimization metrics found for order {orderId}");

            return Ok(metrics);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(new { error = ex.Message });
        }
    }
}