using AutoMapper;
using MaxiCortes.Application.DTOs.Orders;
using MaxiCortes.Application.Interfaces.Repositories;

namespace MaxiCortes.Application.UseCases.Orders;

public class CancelOrderUseCase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMaterialRepository _materialRepository;
    private readonly IMapper _mapper;

    public CancelOrderUseCase(
        IOrderRepository orderRepository,
        IMaterialRepository materialRepository,
        IMapper mapper)
    {
        _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        _materialRepository = materialRepository ?? throw new ArgumentNullException(nameof(materialRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<OrderResponse> ExecuteAsync(
        Guid orderId, 
        string reason, 
        Guid cancelledBy, 
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(reason))
            throw new ArgumentException("Cancellation reason is required", nameof(reason));

        if (cancelledBy == Guid.Empty)
            throw new ArgumentException("Cancelled by user ID is required", nameof(cancelledBy));

        // Get order
        var order = await _orderRepository.GetByIdAsync(orderId, cancellationToken);
        if (order == null)
            throw new InvalidOperationException($"Order with ID {orderId} not found");

        // Validate that order can be cancelled
        if (!order.CanCancel())
            throw new InvalidOperationException($"Order {order.OrderNumber} cannot be cancelled in its current status: {order.Status}");

        // If order was already submitted/approved, restore stock
        if (order.Status != Domain.Entities.OrderStatus.Draft)
        {
            await RestoreStockAsync(order, cancellationToken);
        }

        // Cancel the order
        order.Cancel();

        // Save changes
        var updatedOrder = await _orderRepository.UpdateAsync(order, cancellationToken);

        // TODO: Raise OrderCancelled domain event
        // This would be handled by the domain event dispatcher in a real implementation

        return _mapper.Map<OrderResponse>(updatedOrder);
    }

    private async Task RestoreStockAsync(Domain.Entities.Order order, CancellationToken cancellationToken)
    {
        // Group items by material to restore stock efficiently
        var materialQuantities = order.Items
            .GroupBy(i => i.MaterialId)
            .ToDictionary(g => g.Key, g => g.Sum(i => i.Quantity));

        foreach (var (materialId, quantity) in materialQuantities)
        {
            var material = await _materialRepository.GetByIdAsync(materialId, cancellationToken);
            if (material != null)
            {
                material.UpdateStock(material.StockQuantity + quantity);
                await _materialRepository.UpdateAsync(material, cancellationToken);
            }
        }
    }
}