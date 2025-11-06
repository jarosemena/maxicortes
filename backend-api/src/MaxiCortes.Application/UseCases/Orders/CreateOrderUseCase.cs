using AutoMapper;
using MaxiCortes.Application.DTOs.Orders;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.Services;
using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Application.UseCases.Orders;

public class CreateOrderUseCase
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMaterialRepository _materialRepository;
    private readonly OrderValidationService _validationService;
    private readonly CostCalculationService _costCalculationService;
    private readonly IMapper _mapper;

    public CreateOrderUseCase(
        IOrderRepository orderRepository,
        IMaterialRepository materialRepository,
        OrderValidationService validationService,
        CostCalculationService costCalculationService,
        IMapper mapper)
    {
        _orderRepository = orderRepository ?? throw new ArgumentNullException(nameof(orderRepository));
        _materialRepository = materialRepository ?? throw new ArgumentNullException(nameof(materialRepository));
        _validationService = validationService ?? throw new ArgumentNullException(nameof(validationService));
        _costCalculationService = costCalculationService ?? throw new ArgumentNullException(nameof(costCalculationService));
        _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
    }

    public async Task<OrderResponse> ExecuteAsync(CreateOrderRequest request, CancellationToken cancellationToken = default)
    {
        if (request == null)
            throw new ArgumentNullException(nameof(request));

        // Validate request
        ValidateRequest(request);

        // Check customer limits
        var customerOrders = await _orderRepository.GetByCustomerIdAsync(request.CustomerId, cancellationToken);
        var customerLimitsValidation = _validationService.ValidateCustomerLimits(request.CustomerId, customerOrders);
        if (!customerLimitsValidation.IsValid)
            throw new InvalidOperationException($"Customer validation failed: {string.Join(", ", customerLimitsValidation.Errors)}");

        // Create order
        var order = new Order(request.CustomerId, request.OrderNumber);

        // Get all required materials
        var materialIds = request.Items.Select(i => i.MaterialId).Distinct().ToList();
        var materials = new List<Material>();
        
        foreach (var materialId in materialIds)
        {
            var material = await _materialRepository.GetByIdAsync(materialId, cancellationToken);
            if (material == null)
                throw new InvalidOperationException($"Material with ID {materialId} not found");
            materials.Add(material);
        }

        // Create and add order items
        foreach (var itemRequest in request.Items)
        {
            var material = materials.First(m => m.Id == itemRequest.MaterialId);
            var geometry = _mapper.Map<Geometry>(itemRequest.Geometry);
            var priority = Enum.Parse<Priority>(itemRequest.Priority, true);
            
            // Calculate unit price based on material cost and geometry
            var unitPrice = CalculateUnitPrice(material, geometry);
            
            var orderItem = new OrderItem(
                order.Id,
                material.Id,
                geometry,
                itemRequest.Quantity,
                unitPrice,
                priority);

            order.AddItem(orderItem);
        }

        // Validate the complete order
        var orderValidation = _validationService.ValidateOrder(order, materials);
        if (!orderValidation.IsValid)
            throw new InvalidOperationException($"Order validation failed: {string.Join(", ", orderValidation.Errors)}");

        // Validate stock availability
        var stockValidation = _validationService.ValidateStock(order, materials);
        if (!stockValidation.IsValid)
            throw new InvalidOperationException($"Stock validation failed: {string.Join(", ", stockValidation.Errors)}");

        // Save order
        var savedOrder = await _orderRepository.AddAsync(order, cancellationToken);

        // TODO: Raise OrderCreated domain event
        // This would be handled by the domain event dispatcher in a real implementation

        return _mapper.Map<OrderResponse>(savedOrder);
    }

    private static void ValidateRequest(CreateOrderRequest request)
    {
        var errors = new List<string>();

        if (request.CustomerId == Guid.Empty)
            errors.Add("Customer ID is required");

        if (!request.Items.Any())
            errors.Add("Order must have at least one item");

        foreach (var item in request.Items)
        {
            if (item.MaterialId == Guid.Empty)
                errors.Add("Material ID is required for all items");

            if (item.Geometry == null)
                errors.Add("Geometry is required for all items");

            if (item.Quantity <= 0)
                errors.Add("Quantity must be positive for all items");

            if (string.IsNullOrWhiteSpace(item.Priority))
                errors.Add("Priority is required for all items");
        }

        if (errors.Any())
            throw new ArgumentException($"Validation failed: {string.Join(", ", errors)}");
    }

    private Money CalculateUnitPrice(Material material, Geometry geometry)
    {
        // Simple pricing: base material cost * geometry area ratio
        var geometryArea = geometry.CalculateArea();
        var materialArea = material.CalculateArea();
        var areaRatio = geometryArea / materialArea;
        
        return material.CostPerUnit.Multiply(areaRatio);
    }
}