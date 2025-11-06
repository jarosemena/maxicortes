using Microsoft.AspNetCore.Mvc;
using MaxiCortes.Application.DTOs.Common;
using MaxiCortes.Application.DTOs.Orders;
using MaxiCortes.Application.UseCases.Orders;

namespace MaxiCortes.WebAPI.Controllers;

/// <summary>
/// Controller for managing orders in the cutting optimization system
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class OrdersController : ControllerBase
{
    private readonly CreateOrderUseCase _createOrderUseCase;
    private readonly GetOrderDetailsUseCase _getOrderDetailsUseCase;
    private readonly CancelOrderUseCase _cancelOrderUseCase;

    public OrdersController(
        CreateOrderUseCase createOrderUseCase,
        GetOrderDetailsUseCase getOrderDetailsUseCase,
        CancelOrderUseCase cancelOrderUseCase)
    {
        _createOrderUseCase = createOrderUseCase;
        _getOrderDetailsUseCase = getOrderDetailsUseCase;
        _cancelOrderUseCase = cancelOrderUseCase;
    }

    /// <summary>
    /// Create a new order with multiple materials
    /// </summary>
    /// <param name="request">Order creation data</param>
    /// <returns>Created order</returns>
    [HttpPost]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<OrderResponse>> CreateOrder(
        [FromBody] CreateOrderRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var order = await _createOrderUseCase.ExecuteAsync(request, cancellationToken);
            return CreatedAtAction(
                nameof(GetOrder),
                new { id = order.Id },
                order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Get order by ID with full details
    /// </summary>
    /// <param name="id">Order ID</param>
    /// <returns>Order details including items and materials</returns>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderResponse>> GetOrder(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        var order = await _getOrderDetailsUseCase.ExecuteAsync(id, cancellationToken);
        
        if (order == null)
            return NotFound($"Order with ID {id} not found");

        return Ok(order);
    }

    /// <summary>
    /// Get order by order number
    /// </summary>
    /// <param name="orderNumber">Order number</param>
    /// <returns>Order details</returns>
    [HttpGet("by-number/{orderNumber}")]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderResponse>> GetOrderByNumber(
        string orderNumber,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var order = await _getOrderDetailsUseCase.GetByOrderNumberAsync(orderNumber, cancellationToken);
            
            if (order == null)
                return NotFound($"Order with number {orderNumber} not found");

            return Ok(order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Cancel an order
    /// </summary>
    /// <param name="id">Order ID</param>
    /// <param name="request">Cancellation details</param>
    /// <returns>Updated order</returns>
    [HttpPost("{id:guid}/cancel")]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderResponse>> CancelOrder(
        Guid id,
        [FromBody] CancelOrderRequest request,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var order = await _cancelOrderUseCase.ExecuteAsync(
                id, 
                request.Reason, 
                request.CancelledBy, 
                cancellationToken);
            
            return Ok(order);
        }
        catch (InvalidOperationException ex) when (ex.Message.Contains("not found"))
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}

public class CancelOrderRequest
{
    public string Reason { get; set; } = string.Empty;
    public Guid CancelledBy { get; set; }
}