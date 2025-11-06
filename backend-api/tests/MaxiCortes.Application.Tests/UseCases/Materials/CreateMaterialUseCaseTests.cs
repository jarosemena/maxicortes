using AutoMapper;
using FluentAssertions;
using MaxiCortes.Application.DTOs.Materials;
using MaxiCortes.Application.Interfaces.Repositories;
using MaxiCortes.Application.Mappers;
using MaxiCortes.Application.UseCases.Materials;
using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;
using Moq;
using Xunit;

namespace MaxiCortes.Application.Tests.UseCases.Materials;

public class CreateMaterialUseCaseTests
{
    private readonly Mock<IMaterialRepository> _mockRepository;
    private readonly IMapper _mapper;
    private readonly CreateMaterialUseCase _useCase;

    public CreateMaterialUseCaseTests()
    {
        _mockRepository = new Mock<IMaterialRepository>();
        
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
        
        _useCase = new CreateMaterialUseCase(_mockRepository.Object, _mapper);
    }

    [Fact]
    public async Task ExecuteAsync_WithValidRequest_ShouldCreateMaterialSuccessfully()
    {
        // Arrange
        var request = new CreateMaterialRequest
        {
            Name = "Test Material",
            Type = "Wood",
            Dimensions = new DimensionsDto { Width = 100, Height = 200, Thickness = 5 },
            CostPerUnit = new MoneyDto { Amount = 50.00m, Currency = "USD" },
            StockQuantity = 10
        };

        var expectedMaterial = new Material(
            request.Name,
            MaterialType.Wood,
            new Dimensions(request.Dimensions.Width, request.Dimensions.Height, request.Dimensions.Thickness),
            new Money(request.CostPerUnit.Amount, request.CostPerUnit.Currency),
            request.StockQuantity
        );

        _mockRepository
            .Setup(r => r.AddAsync(It.IsAny<Material>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(expectedMaterial);

        // Act
        var result = await _useCase.ExecuteAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(request.Name);
        result.Type.Should().Be(request.Type);
        result.Dimensions.Width.Should().Be(request.Dimensions.Width);
        result.Dimensions.Height.Should().Be(request.Dimensions.Height);
        result.Dimensions.Thickness.Should().Be(request.Dimensions.Thickness);
        result.CostPerUnit.Amount.Should().Be(request.CostPerUnit.Amount);
        result.CostPerUnit.Currency.Should().Be(request.CostPerUnit.Currency);
        result.StockQuantity.Should().Be(request.StockQuantity);

        _mockRepository.Verify(r => r.AddAsync(It.IsAny<Material>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WithNullRequest_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(null!))
            .Should().ThrowAsync<ArgumentNullException>()
            .WithParameterName("request");
    }

    [Theory]
    [InlineData("", "Wood", 100, 200, 5, 50.00, "USD", 10, "Material name is required")]
    [InlineData("   ", "Wood", 100, 200, 5, 50.00, "USD", 10, "Material name is required")]
    [InlineData("Test Material", "", 100, 200, 5, 50.00, "USD", 10, "Material type is required")]
    [InlineData("Test Material", "Wood", 0, 200, 5, 50.00, "USD", 10, "Width must be positive")]
    [InlineData("Test Material", "Wood", 100, 0, 5, 50.00, "USD", 10, "Height must be positive")]
    [InlineData("Test Material", "Wood", 100, 200, 0, 50.00, "USD", 10, "Thickness must be positive")]
    [InlineData("Test Material", "Wood", 100, 200, 5, -1.00, "USD", 10, "Cost per unit cannot be negative")]
    [InlineData("Test Material", "Wood", 100, 200, 5, 50.00, "USD", -1, "Stock quantity cannot be negative")]
    public async Task ExecuteAsync_WithInvalidRequest_ShouldThrowArgumentException(
        string name, string type, decimal width, decimal height, decimal thickness,
        decimal amount, string currency, int stockQuantity, string expectedErrorMessage)
    {
        // Arrange
        var request = new CreateMaterialRequest
        {
            Name = name,
            Type = type,
            Dimensions = new DimensionsDto { Width = width, Height = height, Thickness = thickness },
            CostPerUnit = new MoneyDto { Amount = amount, Currency = currency },
            StockQuantity = stockQuantity
        };

        // Act & Assert
        var exception = await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<ArgumentException>();
        
        exception.Which.Message.Should().Contain(expectedErrorMessage);
    }

    [Fact]
    public async Task ExecuteAsync_WithNullDimensions_ShouldThrowArgumentException()
    {
        // Arrange
        var request = new CreateMaterialRequest
        {
            Name = "Test Material",
            Type = "Wood",
            Dimensions = null!,
            CostPerUnit = new MoneyDto { Amount = 50.00m, Currency = "USD" },
            StockQuantity = 10
        };

        // Act & Assert
        var exception = await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<ArgumentException>();
        
        exception.Which.Message.Should().Contain("Dimensions are required");
    }

    [Fact]
    public async Task ExecuteAsync_WithNullCostPerUnit_ShouldThrowArgumentException()
    {
        // Arrange
        var request = new CreateMaterialRequest
        {
            Name = "Test Material",
            Type = "Wood",
            Dimensions = new DimensionsDto { Width = 100, Height = 200, Thickness = 5 },
            CostPerUnit = null!,
            StockQuantity = 10
        };

        // Act & Assert
        var exception = await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<ArgumentException>();
        
        exception.Which.Message.Should().Contain("Cost per unit is required");
    }

    [Fact]
    public void Constructor_WithNullRepository_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Action act = () => new CreateMaterialUseCase(null!, _mapper);
        act.Should().Throw<ArgumentNullException>().WithParameterName("materialRepository");
    }

    [Fact]
    public void Constructor_WithNullMapper_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Action act = () => new CreateMaterialUseCase(_mockRepository.Object, null!);
        act.Should().Throw<ArgumentNullException>().WithParameterName("mapper");
    }

    [Fact]
    public async Task ExecuteAsync_WithRepositoryException_ShouldPropagateException()
    {
        // Arrange
        var request = new CreateMaterialRequest
        {
            Name = "Test Material",
            Type = "Wood",
            Dimensions = new DimensionsDto { Width = 100, Height = 200, Thickness = 5 },
            CostPerUnit = new MoneyDto { Amount = 50.00m, Currency = "USD" },
            StockQuantity = 10
        };

        var expectedException = new InvalidOperationException("Database error");
        _mockRepository
            .Setup(r => r.AddAsync(It.IsAny<Material>(), It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(request))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Database error");
    }
}