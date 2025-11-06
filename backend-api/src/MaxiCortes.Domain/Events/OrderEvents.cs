namespace MaxiCortes.Domain.Events;

public class OrderCreated : DomainEvent
{
    public Guid OrderId { get; }
    public Guid CustomerId { get; }
    public string OrderNumber { get; }
    public int ItemCount { get; }

    public OrderCreated(Guid orderId, Guid customerId, string orderNumber, int itemCount)
    {
        OrderId = orderId;
        CustomerId = customerId;
        OrderNumber = orderNumber;
        ItemCount = itemCount;
    }
}

public class OrderValidated : DomainEvent
{
    public Guid OrderId { get; }
    public bool IsValid { get; }
    public List<string> ValidationErrors { get; }

    public OrderValidated(Guid orderId, bool isValid, List<string> validationErrors)
    {
        OrderId = orderId;
        IsValid = isValid;
        ValidationErrors = validationErrors ?? new List<string>();
    }
}

public class OrderCancelled : DomainEvent
{
    public Guid OrderId { get; }
    public string Reason { get; }
    public Guid CancelledBy { get; }

    public OrderCancelled(Guid orderId, string reason, Guid cancelledBy)
    {
        OrderId = orderId;
        Reason = reason;
        CancelledBy = cancelledBy;
    }
}

public class OrderSubmitted : DomainEvent
{
    public Guid OrderId { get; }
    public decimal TotalAmount { get; }
    public int TotalItems { get; }

    public OrderSubmitted(Guid orderId, decimal totalAmount, int totalItems)
    {
        OrderId = orderId;
        TotalAmount = totalAmount;
        TotalItems = totalItems;
    }
}

public class OrderApproved : DomainEvent
{
    public Guid OrderId { get; }
    public Guid ApprovedBy { get; }
    public DateTime ApprovedAt { get; }

    public OrderApproved(Guid orderId, Guid approvedBy)
    {
        OrderId = orderId;
        ApprovedBy = approvedBy;
        ApprovedAt = DateTime.UtcNow;
    }
}

public class OrderCompleted : DomainEvent
{
    public Guid OrderId { get; }
    public DateTime CompletedAt { get; }
    public decimal FinalAmount { get; }

    public OrderCompleted(Guid orderId, decimal finalAmount)
    {
        OrderId = orderId;
        CompletedAt = DateTime.UtcNow;
        FinalAmount = finalAmount;
    }
}