using AutoMapper;
using FluentAssertions;
using MaxiCortes.Application.DTOs.Orders;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Application.Mappers;
using MaxiCortes.Application.UseCases.Orders;
using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;
using MaxiCortes.Domain.Services;
using Moq;
using Xunit;

namespace MaxiCortes.Application.Tests.UseCases.Orders;

public class CreateOrderUseCaseTests
{
    private readonly Mock<IOrderRepository> _mockOrderRepository;
    private readonly Mock<IMaterialRepository> _mockMaterialRepository;
    private readonly Mock<OrderValidationService> _mockValidationService;
    private readonly Mock<CostCalculationService> _mockCostService;
    private readonly IMapper _mapper;
    private readonly CreateOrderUseCase _useCase;

    public CreateOrderUseCaseTests()
    {
        _mockOrderRepository = new Mock<IOrderRepository>();
        _mockMaterialRepository = new Mock<IMaterialRepository>();
        _mockValidationService = new Mock<OrderValidationService>();
        _mockCostService = new Mock<CostCalculationService>();
        
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
        
        _useCase = new CreateOrderUseCase(
            _mockOrderRepository.Object,
            _mockMaterialRepository.Object,
            _mockValidationService.Object,
            _mockCostService.Object,
            _mapper
        );
    }

    [Fact]
    public async Task ExecuteAsync_WithValidRequest_ShouldCreateOrderSuccessfully()
    {
        // Arrange
        var request = CreateValidOrderRequest();
        var material = CreateTestMaterial();
        var expectedOrder = CreateTestOrder();
        var validationResult = new ValidationResult(true, new List<string>());

        _mockMaterialRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(material);

        _mockOrderRepository
            .Setup(r => r.GetByCustomerIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Order>());

        _mockValidationService
            .Setup(s => s.ValidateCustomerLimits(It.IsAny<Guid>(), It.IsAny<IEnumerable<Order>>()))
            .Returns(validationResult);

        _mockValidationService
            .Setup(s => s.ValidateOrder(It.IsAny<Order>(), It.IsAny<IEnumerable<Material>>()))
            .Returns(validationResult);

        _mockValidationService
            .Setup(s => s.ValidateStock(It.IsAny<Order>(), It.IsAny<IEnumerable<Material>>()))
            .Returns(validationResult);

        _mockOrderRepository
            .Setup(r => r.AddAsync(It.IsAny<Order>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedOrder);

        // Act
        var result = await _useCase.ExecuteAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.CustomerId.Should().Be(request.CustomerId);

        _mockOrderRepository.Verify(r => r.AddAsync(It.IsAny<Order>(), It.IsAny<CancellationToken>()), Times.Once);
        _mockValidationService.Verify(s => s.ValidateCustomerLimits(It.IsAny<Guid>(), It.IsAny<IEnumerable<Order>>()), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WithNullRequest_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(null!))
            .Should().ThrowAsync<ArgumentNullException>()
            .WithParameterName("request");
    }

    [Fact]
    public async Task ExecuteAsync_WithEmptyCustomerId_ShouldThrowArgumentException()
    {
        // Arrange
        var request = CreateValidOrderRequest();
        request.CustomerId = Guid.Empty;

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Customer ID is required*");
    }

    [Fact]
    public async Task ExecuteAsync_WithEmptyItems_ShouldThrowArgumentException()
    {
        // Arrange
        var request = CreateValidOrderRequest();
        request.Items = new List<CreateOrderItemRequest>();

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Order must have at least one item*");
    }

    [Fact]
    public async Task ExecuteAsync_WithNonExistentMaterial_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var request = CreateValidOrderRequest();

        _mockOrderRepository
            .Setup(r => r.GetByCustomerIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Order>());

        _mockMaterialRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync((Material?)null);

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Material*not found*");
    }

    [Fact]
    public async Task ExecuteAsync_WithCustomerLimitExceeded_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var request = CreateValidOrderRequest();
        var material = CreateTestMaterial();
        var validationResult = new ValidationResult(false, new[] { "Customer has reached the maximum number of pending orders" });

        _mockMaterialRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(material);

        _mockOrderRepository
            .Setup(r => r.GetByCustomerIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Order>());

        _mockValidationService
            .Setup(s => s.ValidateCustomerLimits(It.IsAny<Guid>(), It.IsAny<IEnumerable<Order>>()))
            .Returns(validationResult);

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Customer validation failed*");
    }

    [Fact]
    public void Constructor_WithNullOrderRepository_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Action act = () => new CreateOrderUseCase(null!, _mockMaterialRepository.Object, _mockValidationService.Object, _mockCostService.Object, _mapper);
        act.Should().Throw<ArgumentNullException>().WithParameterName("orderRepository");
    }

    [Fact]
    public void Constructor_WithNullMaterialRepository_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Action act = () => new CreateOrderUseCase(_mockOrderRepository.Object, null!, _mockValidationService.Object, _mockCostService.Object, _mapper);
        act.Should().Throw<ArgumentNullException>().WithParameterName("materialRepository");
    }

    [Fact]
    public void Constructor_WithNullValidationService_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Action act = () => new CreateOrderUseCase(_mockOrderRepository.Object, _mockMaterialRepository.Object, null!, _mockCostService.Object, _mapper);
        act.Should().Throw<ArgumentNullException>().WithParameterName("validationService");
    }

    [Fact]
    public void Constructor_WithNullCostService_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Action act = () => new CreateOrderUseCase(_mockOrderRepository.Object, _mockMaterialRepository.Object, _mockValidationService.Object, null!, _mapper);
        act.Should().Throw<ArgumentNullException>().WithParameterName("costCalculationService");
    }

    [Fact]
    public void Constructor_WithNullMapper_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Action act = () => new CreateOrderUseCase(_mockOrderRepository.Object, _mockMaterialRepository.Object, _mockValidationService.Object, _mockCostService.Object, null!);
        act.Should().Throw<ArgumentNullException>().WithParameterName("mapper");
    }

    [Fact]
    public async Task ExecuteAsync_WithInvalidQuantity_ShouldThrowArgumentException()
    {
        // Arrange
        var request = CreateValidOrderRequest();
        request.Items[0].Quantity = 0;

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Quantity must be positive*");
    }

    [Fact]
    public async Task ExecuteAsync_WithNullGeometry_ShouldThrowArgumentException()
    {
        // Arrange
        var request = CreateValidOrderRequest();
        request.Items[0].Geometry = null!;

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Geometry is required*");
    }

    [Fact]
    public async Task ExecuteAsync_WithEmptyPriority_ShouldThrowArgumentException()
    {
        // Arrange
        var request = CreateValidOrderRequest();
        request.Items[0].Priority = "";

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Priority is required*");
    }

    [Fact]
    public async Task ExecuteAsync_WithOrderValidationFailure_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var request = CreateValidOrderRequest();
        var material = CreateTestMaterial();
        var customerValidationResult = new ValidationResult(true, new List<string>());
        var orderValidationResult = new ValidationResult(false, new[] { "Order validation failed" });

        _mockMaterialRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(material);

        _mockOrderRepository
            .Setup(r => r.GetByCustomerIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Order>());

        _mockValidationService
            .Setup(s => s.ValidateCustomerLimits(It.IsAny<Guid>(), It.IsAny<IEnumerable<Order>>()))
            .Returns(customerValidationResult);

        _mockValidationService
            .Setup(s => s.ValidateOrder(It.IsAny<Order>(), It.IsAny<IEnumerable<Material>>()))
            .Returns(orderValidationResult);

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Order validation failed*");
    }

    [Fact]
    public async Task ExecuteAsync_WithStockValidationFailure_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var request = CreateValidOrderRequest();
        var material = CreateTestMaterial();
        var customerValidationResult = new ValidationResult(true, new List<string>());
        var orderValidationResult = new ValidationResult(true, new List<string>());
        var stockValidationResult = new ValidationResult(false, new[] { "Insufficient stock" });

        _mockMaterialRepository
            .Setup(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(material);

        _mockOrderRepository
            .Setup(r => r.GetByCustomerIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Order>());

        _mockValidationService
            .Setup(s => s.ValidateCustomerLimits(It.IsAny<Guid>(), It.IsAny<IEnumerable<Order>>()))
            .Returns(customerValidationResult);

        _mockValidationService
            .Setup(s => s.ValidateOrder(It.IsAny<Order>(), It.IsAny<IEnumerable<Material>>()))
            .Returns(orderValidationResult);

        _mockValidationService
            .Setup(s => s.ValidateStock(It.IsAny<Order>(), It.IsAny<IEnumerable<Material>>()))
            .Returns(stockValidationResult);

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Stock validation failed*");
    }

    [Fact]
    public async Task ExecuteAsync_WithMultipleMaterials_ShouldCreateOrderSuccessfully()
    {
        // Arrange
        var request = CreateOrderRequestWithMultipleMaterials();
        var material1 = CreateTestMaterial();
        var material2 = CreateTestMaterial();
        var expectedOrder = CreateTestOrder();
        var validationResult = new ValidationResult(true, new List<string>());

        _mockMaterialRepository
            .SetupSequence(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(material1)
            .ReturnsAsync(material2);

        _mockOrderRepository
            .Setup(r => r.GetByCustomerIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<Order>());

        _mockValidationService
            .Setup(s => s.ValidateCustomerLimits(It.IsAny<Guid>(), It.IsAny<IEnumerable<Order>>()))
            .Returns(validationResult);

        _mockValidationService
            .Setup(s => s.ValidateOrder(It.IsAny<Order>(), It.IsAny<IEnumerable<Material>>()))
            .Returns(validationResult);

        _mockValidationService
            .Setup(s => s.ValidateStock(It.IsAny<Order>(), It.IsAny<IEnumerable<Material>>()))
            .Returns(validationResult);

        _mockOrderRepository
            .Setup(r => r.AddAsync(It.IsAny<Order>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedOrder);

        // Act
        var result = await _useCase.ExecuteAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.CustomerId.Should().Be(request.CustomerId);

        _mockMaterialRepository.Verify(r => r.GetByIdAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()), Times.Exactly(2));
        _mockOrderRepository.Verify(r => r.AddAsync(It.IsAny<Order>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    private static CreateOrderRequest CreateValidOrderRequest()
    {
        return new CreateOrderRequest
        {
            CustomerId = Guid.NewGuid(),
            OrderNumber = "ORD-001",
            Items = new List<CreateOrderItemRequest>
            {
                new CreateOrderItemRequest
                {
                    MaterialId = Guid.NewGuid(),
                    Quantity = 2,
                    Priority = "Normal",
                    Geometry = new PolygonDto
                    {
                        Points = new List<PointDto>
                        {
                            new PointDto { X = 0, Y = 0 },
                            new PointDto { X = 100, Y = 0 },
                            new PointDto { X = 100, Y = 50 },
                            new PointDto { X = 0, Y = 50 }
                        }
                    }
                }
            }
        };
    }

    private static Material CreateTestMaterial()
    {
        return new Material(
            "Test Material",
            MaterialType.Wood,
            new Dimensions(200, 100, 5),
            new Money(50.00m),
            10
        );
    }

    private static Order CreateTestOrder()
    {
        return new Order(Guid.NewGuid(), "ORD-001");
    }

    private static CreateOrderRequest CreateOrderRequestWithMultipleMaterials()
    {
        return new CreateOrderRequest
        {
            CustomerId = Guid.NewGuid(),
            OrderNumber = "ORD-002",
            Items = new List<CreateOrderItemRequest>
            {
                new CreateOrderItemRequest
                {
                    MaterialId = Guid.NewGuid(),
                    Quantity = 1,
                    Priority = "High",
                    Geometry = new CircleDto
                    {
                        Center = new PointDto { X = 50, Y = 50 },
                        Radius = 25
                    }
                },
                new CreateOrderItemRequest
                {
                    MaterialId = Guid.NewGuid(),
                    Quantity = 3,
                    Priority = "Normal",
                    Geometry = new OvalDto
                    {
                        Center = new PointDto { X = 75, Y = 75 },
                        RadiusX = 30,
                        RadiusY = 20
                    }
                }
            }
        };
    }
}

