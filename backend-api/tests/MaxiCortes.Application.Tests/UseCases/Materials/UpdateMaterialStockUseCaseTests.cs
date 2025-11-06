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

public class UpdateMaterialStockUseCaseTests
{
    private readonly Mock<IMaterialRepository> _mockRepository;
    private readonly IMapper _mapper;
    private readonly UpdateMaterialStockUseCase _useCase;

    public UpdateMaterialStockUseCaseTests()
    {
        _mockRepository = new Mock<IMaterialRepository>();
        
        var config = new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>());
        _mapper = config.CreateMapper();
        
        _useCase = new UpdateMaterialStockUseCase(_mockRepository.Object, _mapper);
    }

    [Fact]
    public async Task ExecuteAsync_WithValidRequest_ShouldUpdateStockSuccessfully()
    {
        // Arrange
        var materialId = Guid.NewGuid();
        var request = new UpdateMaterialStockRequest
        {
            NewQuantity = 50,
            Reason = "Stock replenishment"
        };
        var material = CreateTestMaterial();

        _mockRepository
            .Setup(r => r.GetByIdAsync(materialId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(material);

        _mockRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Material>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(material);

        // Act
        var result = await _useCase.ExecuteAsync(materialId, request);

        // Assert
        result.Should().NotBeNull();
        result.StockQuantity.Should().Be(request.NewQuantity);

        _mockRepository.Verify(r => r.GetByIdAsync(materialId, It.IsAny<CancellationToken>()), Times.Once);
        _mockRepository.Verify(r => r.UpdateAsync(It.IsAny<Material>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ExecuteAsync_WithNullRequest_ShouldThrowArgumentNullException()
    {
        // Arrange
        var materialId = Guid.NewGuid();

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(materialId, null!))
            .Should().ThrowAsync<ArgumentNullException>()
            .WithParameterName("request");
    }

    [Fact]
    public async Task ExecuteAsync_WithEmptyMaterialId_ShouldThrowArgumentException()
    {
        // Arrange
        var request = new UpdateMaterialStockRequest
        {
            NewQuantity = 50,
            Reason = "Stock replenishment"
        };

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(Guid.Empty, request))
            .Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Material ID is required*");
    }

    [Fact]
    public async Task ExecuteAsync_WithNegativeQuantity_ShouldThrowArgumentException()
    {
        // Arrange
        var materialId = Guid.NewGuid();
        var request = new UpdateMaterialStockRequest
        {
            NewQuantity = -5,
            Reason = "Invalid quantity"
        };

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(materialId, request))
            .Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Stock quantity cannot be negative*");
    }

    [Fact]
    public async Task ExecuteAsync_WithEmptyReason_ShouldThrowArgumentException()
    {
        // Arrange
        var materialId = Guid.NewGuid();
        var request = new UpdateMaterialStockRequest
        {
            NewQuantity = 50,
            Reason = ""
        };

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(materialId, request))
            .Should().ThrowAsync<ArgumentException>()
            .WithMessage("*Reason is required*");
    }

    [Fact]
    public async Task ExecuteAsync_WithNonExistentMaterial_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var materialId = Guid.NewGuid();
        var request = new UpdateMaterialStockRequest
        {
            NewQuantity = 50,
            Reason = "Stock replenishment"
        };

        _mockRepository
            .Setup(r => r.GetByIdAsync(materialId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Material?)null);

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(materialId, request))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage($"Material with ID {materialId} not found");
    }

    [Fact]
    public async Task ExecuteAsync_WithInactiveMaterial_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var materialId = Guid.NewGuid();
        var request = new UpdateMaterialStockRequest
        {
            NewQuantity = 50,
            Reason = "Stock replenishment"
        };
        var material = CreateTestMaterial();
        material.Deactivate(); // Assuming this method exists

        _mockRepository
            .Setup(r => r.GetByIdAsync(materialId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(material);

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(materialId, request))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("*Cannot update stock for inactive material*");
    }

    [Fact]
    public async Task ExecuteAsync_WithRepositoryException_ShouldPropagateException()
    {
        // Arrange
        var materialId = Guid.NewGuid();
        var request = new UpdateMaterialStockRequest
        {
            NewQuantity = 50,
            Reason = "Stock replenishment"
        };
        var expectedException = new InvalidOperationException("Database error");

        _mockRepository
            .Setup(r => r.GetByIdAsync(materialId, It.IsAny<CancellationToken>()))
            .ThrowsAsync(expectedException);

        // Act & Assert
        await _useCase.Invoking(x => x.ExecuteAsync(materialId, request))
            .Should().ThrowAsync<InvalidOperationException>()
            .WithMessage("Database error");
    }

    [Fact]
    public void Constructor_WithNullRepository_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Action act = () => new UpdateMaterialStockUseCase(null!, _mapper);
        act.Should().Throw<ArgumentNullException>().WithParameterName("materialRepository");
    }

    [Fact]
    public void Constructor_WithNullMapper_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        Action act = () => new UpdateMaterialStockUseCase(_mockRepository.Object, null!);
        act.Should().Throw<ArgumentNullException>().WithParameterName("mapper");
    }

    [Theory]
    [InlineData(0, "Zero stock")]
    [InlineData(1, "Minimum stock")]
    [InlineData(100, "High stock")]
    [InlineData(9999, "Maximum stock")]
    public async Task ExecuteAsync_WithValidQuantities_ShouldUpdateSuccessfully(int quantity, string reason)
    {
        // Arrange
        var materialId = Guid.NewGuid();
        var request = new UpdateMaterialStockRequest
        {
            NewQuantity = quantity,
            Reason = reason
        };
        var material = CreateTestMaterial();

        _mockRepository
            .Setup(r => r.GetByIdAsync(materialId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(material);

        _mockRepository
            .Setup(r => r.UpdateAsync(It.IsAny<Material>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(material);

        // Act
        var result = await _useCase.ExecuteAsync(materialId, request);

        // Assert
        result.Should().NotBeNull();
        result.StockQuantity.Should().Be(quantity);
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
}