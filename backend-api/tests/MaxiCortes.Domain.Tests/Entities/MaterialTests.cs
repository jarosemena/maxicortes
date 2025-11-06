using FluentAssertions;
using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Domain.Tests.Entities;

public class MaterialTests
{
    private readonly Dimensions _validDimensions = new(244.0m, 122.0m, 1.8m);
    private readonly Money _validCost = new(45.50m);

    [Fact]
    public void Constructor_WithValidParameters_ShouldCreateMaterial()
    {
        // Arrange
        var name = "MDF 18mm Standard";
        var type = MaterialType.Wood;
        var stockQuantity = 50;

        // Act
        var material = new Material(name, type, _validDimensions, _validCost, stockQuantity);

        // Assert
        material.Id.Should().NotBeEmpty();
        material.Name.Should().Be(name);
        material.Type.Should().Be(type);
        material.Dimensions.Should().Be(_validDimensions);
        material.CostPerUnit.Should().Be(_validCost);
        material.StockQuantity.Should().Be(stockQuantity);
        material.IsActive.Should().BeTrue();
        material.CreatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        material.UpdatedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Constructor_WithDefaultStock_ShouldSetStockToZero()
    {
        // Act
        var material = new Material("Test Material", MaterialType.Wood, _validDimensions, _validCost);

        // Assert
        material.StockQuantity.Should().Be(0);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Constructor_WithInvalidName_ShouldThrowArgumentException(string invalidName)
    {
        // Act & Assert
        var act = () => new Material(invalidName, MaterialType.Wood, _validDimensions, _validCost);
        act.Should().Throw<ArgumentException>()
           .WithMessage("Material name cannot be empty*");
    }

    [Fact]
    public void Constructor_WithNegativeStock_ShouldThrowArgumentException()
    {
        // Act & Assert
        var act = () => new Material("Test", MaterialType.Wood, _validDimensions, _validCost, -1);
        act.Should().Throw<ArgumentException>()
           .WithMessage("Stock quantity cannot be negative*");
    }

    [Fact]
    public void Constructor_WithNullDimensions_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        var act = () => new Material("Test", MaterialType.Wood, null!, _validCost);
        act.Should().Throw<ArgumentNullException>()
           .WithParameterName("dimensions");
    }

    [Fact]
    public void Constructor_WithNullCost_ShouldThrowArgumentNullException()
    {
        // Act & Assert
        var act = () => new Material("Test", MaterialType.Wood, _validDimensions, null!);
        act.Should().Throw<ArgumentNullException>()
           .WithParameterName("costPerUnit");
    }

    [Fact]
    public void UpdateStock_WithValidQuantity_ShouldUpdateStockAndTimestamp()
    {
        // Arrange
        var material = new Material("Test", MaterialType.Wood, _validDimensions, _validCost, 10);
        var originalUpdatedAt = material.UpdatedAt;
        Thread.Sleep(10); // Ensure timestamp difference

        // Act
        material.UpdateStock(25);

        // Assert
        material.StockQuantity.Should().Be(25);
        material.UpdatedAt.Should().BeAfter(originalUpdatedAt);
    }

    [Fact]
    public void UpdateStock_WithNegativeQuantity_ShouldThrowArgumentException()
    {
        // Arrange
        var material = new Material("Test", MaterialType.Wood, _validDimensions, _validCost);

        // Act & Assert
        var act = () => material.UpdateStock(-5);
        act.Should().Throw<ArgumentException>()
           .WithMessage("Stock quantity cannot be negative*");
    }

    [Fact]
    public void UpdateCost_WithValidCost_ShouldUpdateCostAndTimestamp()
    {
        // Arrange
        var material = new Material("Test", MaterialType.Wood, _validDimensions, _validCost);
        var newCost = new Money(75.00m);
        var originalUpdatedAt = material.UpdatedAt;
        Thread.Sleep(10);

        // Act
        material.UpdateCost(newCost);

        // Assert
        material.CostPerUnit.Should().Be(newCost);
        material.UpdatedAt.Should().BeAfter(originalUpdatedAt);
    }

    [Fact]
    public void UpdateCost_WithNullCost_ShouldThrowArgumentNullException()
    {
        // Arrange
        var material = new Material("Test", MaterialType.Wood, _validDimensions, _validCost);

        // Act & Assert
        var act = () => material.UpdateCost(null!);
        act.Should().Throw<ArgumentNullException>()
           .WithParameterName("newCost");
    }

    [Fact]
    public void Deactivate_ShouldSetIsActiveToFalseAndUpdateTimestamp()
    {
        // Arrange
        var material = new Material("Test", MaterialType.Wood, _validDimensions, _validCost);
        var originalUpdatedAt = material.UpdatedAt;
        Thread.Sleep(10);

        // Act
        material.Deactivate();

        // Assert
        material.IsActive.Should().BeFalse();
        material.UpdatedAt.Should().BeAfter(originalUpdatedAt);
    }

    [Fact]
    public void Activate_ShouldSetIsActiveToTrueAndUpdateTimestamp()
    {
        // Arrange
        var material = new Material("Test", MaterialType.Wood, _validDimensions, _validCost);
        material.Deactivate();
        var originalUpdatedAt = material.UpdatedAt;
        Thread.Sleep(10);

        // Act
        material.Activate();

        // Assert
        material.IsActive.Should().BeTrue();
        material.UpdatedAt.Should().BeAfter(originalUpdatedAt);
    }

    [Theory]
    [InlineData(10, 5, true)]
    [InlineData(10, 10, true)]
    [InlineData(10, 15, false)]
    [InlineData(0, 1, false)]
    public void HasSufficientStock_ShouldReturnCorrectResult(int stockQuantity, int requiredQuantity, bool expected)
    {
        // Arrange
        var material = new Material("Test", MaterialType.Wood, _validDimensions, _validCost, stockQuantity);

        // Act
        var result = material.HasSufficientStock(requiredQuantity);

        // Assert
        result.Should().Be(expected);
    }

    [Fact]
    public void HasSufficientStock_WhenInactive_ShouldReturnFalse()
    {
        // Arrange
        var material = new Material("Test", MaterialType.Wood, _validDimensions, _validCost, 10);
        material.Deactivate();

        // Act
        var result = material.HasSufficientStock(5);

        // Assert
        result.Should().BeFalse();
    }

    [Fact]
    public void CalculateArea_ShouldReturnCorrectArea()
    {
        // Arrange
        var dimensions = new Dimensions(100m, 50m, 2m);
        var material = new Material("Test", MaterialType.Wood, dimensions, _validCost);

        // Act
        var area = material.CalculateArea();

        // Assert
        area.Should().Be(5000m);
    }
}