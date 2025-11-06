using MaxiCortes.Application.DTOs.Optimization;

namespace MaxiCortes.Application.Interfaces.Services;

public interface IOptimizationService
{
    Task<OptimizationResultResponse> OptimizeOrderAsync(
        Guid orderId, 
        OptimizationParametersDto parameters, 
        CancellationToken cancellationToken = default);
    
    Task<OptimizationResultResponse?> GetOptimizationResultAsync(
        Guid orderId, 
        CancellationToken cancellationToken = default);
}