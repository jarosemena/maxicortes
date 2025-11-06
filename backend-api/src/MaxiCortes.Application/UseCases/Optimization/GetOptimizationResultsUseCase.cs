using MaxiCortes.Application.DTOs.Optimization;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Application.Interfaces.Services;

namespace MaxiCortes.Application.UseCases.Optimization;

public class GetOptimizationResultsUseCase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOptimizationService _optimizationService;

    public GetOptimizationResultsUseCase(
        IOrderRepository orderRepository,
        IOptimizationService optimizationService)
    {
        _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        _optimizationService = optimizationService ?? throw new ArgumentNullException(nameof(optimizationService));
    }

    public async Task<OptimizationResultResponse?> ExecuteAsync(
        Guid orderId, 
        CancellationToken cancellationToken = default)
    {
        // Validate order exists
        var order = await _orderRepository.GetByIdAsync(orderId, cancellationToken);
        if (order == null)
            throw new InvalidOperationException($"Order with ID {orderId} not found");

        // Get optimization results
        var result = await _optimizationService.GetOptimizationResultAsync(orderId, cancellationToken);
        
        return result;
    }

    public async Task<OptimizationMetricsResponse?> GetOptimizationMetricsAsync(
        Guid orderId, 
        CancellationToken cancellationToken = default)
    {
        var result = await ExecuteAsync(orderId, cancellationToken);
        return result?.Metrics;
    }
}