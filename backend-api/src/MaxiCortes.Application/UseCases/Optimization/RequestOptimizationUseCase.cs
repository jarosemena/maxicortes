using MaxiCortes.Application.DTOs.Optimization;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Application.Interfaces.Services;

namespace MaxiCortes.Application.UseCases.Optimization;

public class RequestOptimizationUseCase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IOptimizationService _optimizationService;

    public RequestOptimizationUseCase(
        IOrderRepository orderRepository,
        IOptimizationService optimizationService)
    {
        _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        _optimizationService = optimizationService ?? throw new ArgumentNullException(nameof(optimizationService));
    }

    public async Task<OptimizationResultResponse> ExecuteAsync(
        RequestOptimizationRequest request, 
        CancellationToken cancellationToken = default)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        // Validate request
        ValidateRequest(request);

        // Get order
        var order = await _orderRepository.GetByIdAsync(request.OrderId, cancellationToken);
        if (order == null)
            throw new InvalidOperationException($"Order with ID {request.OrderId} not found");

        // Validate order status
        if (order.Status != Domain.Entities.OrderStatus.Approved)
            throw new InvalidOperationException($"Order {order.OrderNumber} must be approved before optimization. Current status: {order.Status}");

        if (!order.Items.Any())
            throw new InvalidOperationException($"Order {order.OrderNumber} has no items to optimize");

        try
        {
            // Request optimization from external service
            var result = await _optimizationService.OptimizeOrderAsync(
                request.OrderId, 
                request.Parameters, 
                cancellationToken);

            // TODO: Store optimization results in database
            // TODO: Raise OptimizationRequested domain event

            return result;
        }
        catch (TimeoutException)
        {
            throw new InvalidOperationException($"Optimization request for order {order.OrderNumber} timed out. Please try again with different parameters.");
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException($"Optimization failed for order {order.OrderNumber}: {ex.Message}", ex);
        }
    }

    private static void ValidateRequest(RequestOptimizationRequest request)
    {
        var errors = new List<string>();

        if (request.OrderId == Guid.Empty)
            errors.Add("Order ID is required");

        if (request.Parameters == null)
            errors.Add("Optimization parameters are required");
        else
        {
            if (request.Parameters.MinimumWasteThreshold < 0 || request.Parameters.MinimumWasteThreshold > 1)
                errors.Add("Minimum waste threshold must be between 0 and 1");

            if (request.Parameters.MaxOptimizationTimeSeconds <= 0 || request.Parameters.MaxOptimizationTimeSeconds > 3600)
                errors.Add("Max optimization time must be between 1 and 3600 seconds");

            if (string.IsNullOrWhiteSpace(request.Parameters.Algorithm))
                errors.Add("Algorithm is required");
        }

        if (errors.Any())
            throw new ArgumentException($"Validation failed: {string.Join(", ", errors)}");
    }
}