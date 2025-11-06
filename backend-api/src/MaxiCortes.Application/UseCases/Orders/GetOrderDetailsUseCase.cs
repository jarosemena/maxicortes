using AutoMapper;
using MaxiCortes.Application.DTOs.Orders;
using MaxiCortes.Application.Interfaces.Repositories;

namespace MaxiCortes.Application.UseCases.Orders;

public class GetOrderDetailsUseCase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMapper _mapper;

    public GetOrderDetailsUseCase(IOrderRepository orderRepository, IMapper mapper)
    {
        _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<OrderResponse?> ExecuteAsync(Guid orderId, CancellationToken cancellationToken = default)
    {
        var order = await _orderRepository.GetByIdAsync(orderId, cancellationToken);
        return order != null ? _mapper.Map<OrderResponse>(order) : null;
    }

    public async Task<OrderResponse?> GetByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(orderNumber))
            throw new ArgumentException("Order number cannot be empty", nameof(orderNumber));

        var order = await _orderRepository.GetByOrderNumberAsync(orderNumber, cancellationToken);
        return order != null ? _mapper.Map<OrderResponse>(order) : null;
    }
}