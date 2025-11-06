using MaxiCortes.Domain.Entities;
using MaxiCortes.Domain.ValueObjects;
using Xunit;

namespace MaxiCortes.Domain.Tests.Entities;

public class OrderTests
{
    private readonly Guid _customerId = Guid.NewGuid();
    private readonly Material _testMaterial;
    private readonly OrderItem _testItem;

    public OrderTests()
    {
        _testMaterial = new Material(
            "Test Wood",
            MaterialType.Wood,
            new Dimensions(100, 200, 5),
            new Money(50.00m)
        );

        var geometry = new Circle(new Point(10, 10), 5);
        _testItem = new OrderItem(
            Guid.NewGuid(),
            _testMaterial.Id,
            geometry,
            2,
            new Money(25.00m)
        );
    }

    [Fact]
    public void Constructor_ShouldCreateOrderWithCorrectProperties()
    {
        // Act
        var order = new Order(_customerId);

        // Assert
        Assert.NotEqual(Guid.Empty, order.Id);
        Assert.Equal(_customerId, order.CustomerId);
        Assert.NotEmpty(order.OrderNumber);
        Assert.Equal(OrderStatus.Draft, order.Status);
        Assert.True(order.CreatedAt <= DateTime.UtcNow);
        Assert.Empty(order.Items);
    }

    [Fact]
    public void Constructor_WithCustomOrderNumber_ShouldUseProvidedNumber()
    {
        // Arrange
        var customOrderNumber = "CUSTOM-001";

        // Act
        var order = new Order(_customerId, customOrderNumber);

        // Assert
        Assert.Equal(customOrderNumber, order.OrderNumber);
    }

    [Fact]
    public void AddItem_ShouldAddItemToOrder()
    {
        // Arrange
        var order = new Order(_customerId);

        // Act
        order.AddItem(_testItem);

        // Assert
        Assert.Single(order.Items);
        Assert.Contains(_testItem, order.Items);
    }

    [Fact]
    public void AddItem_WithSameMaterial_ShouldCombineQuantities()
    {
        // Arrange
        var order = new Order(_customerId);
        var geometry = new Circle(new Point(10, 10), 5);
        var item1 = new OrderItem(order.Id, _testMaterial.Id, geometry, 2, new Money(25.00m));
        var item2 = new OrderItem(order.Id, _testMaterial.Id, geometry, 3, new Money(25.00m));

        // Act
        order.AddItem(item1);
        order.AddItem(item2);

        // Assert
        Assert.Single(order.Items);
        Assert.Equal(5, order.Items.First().Quantity);
    }

    [Fact]
    public void AddItem_ToNonDraftOrder_ShouldThrowException()
    {
        // Arrange
        var order = new Order(_customerId);
        order.AddItem(_testItem); // Add item first so we can submit
        order.Submit();

        // Create a new item to try to add
        var geometry = new Circle(new Point(15, 15), 3);
        var newItem = new OrderItem(
            order.Id,
            Guid.NewGuid(),
            geometry,
            1,
            new Money(20.00m)
        );

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => order.AddItem(newItem));
    }

    [Fact]
    public void AddItem_WithNullItem_ShouldThrowException()
    {
        // Arrange
        var order = new Order(_customerId);

        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => order.AddItem(null!));
    }

    [Fact]
    public void RemoveItem_ShouldRemoveItemFromOrder()
    {
        // Arrange
        var order = new Order(_customerId);
        order.AddItem(_testItem);

        // Act
        order.RemoveItem(_testItem.Id);

        // Assert
        Assert.Empty(order.Items);
    }

    [Fact]
    public void RemoveItem_FromNonDraftOrder_ShouldThrowException()
    {
        // Arrange
        var order = new Order(_customerId);
        order.AddItem(_testItem);
        order.Submit();

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => order.RemoveItem(_testItem.Id));
    }

    [Fact]
    public void CalculateTotal_WithMultipleItems_ShouldReturnCorrectTotal()
    {
        // Arrange
        var order = new Order(_customerId);
        var geometry = new Circle(new Point(10, 10), 5);
        var item1 = new OrderItem(order.Id, Guid.NewGuid(), geometry, 2, new Money(25.00m));
        var item2 = new OrderItem(order.Id, Guid.NewGuid(), geometry, 1, new Money(30.00m));

        order.AddItem(item1);
        order.AddItem(item2);

        // Act
        var total = order.CalculateTotal();

        // Assert
        Assert.Equal(80.00m, total.Amount); // (2 * 25) + (1 * 30) = 80
    }

    [Fact]
    public void CalculateTotal_WithNoItems_ShouldReturnZero()
    {
        // Arrange
        var order = new Order(_customerId);

        // Act
        var total = order.CalculateTotal();

        // Assert
        Assert.Equal(0m, total.Amount);
    }

    [Fact]
    public void Submit_FromDraftStatus_ShouldChangeToPending()
    {
        // Arrange
        var order = new Order(_customerId);
        order.AddItem(_testItem);

        // Act
        order.Submit();

        // Assert
        Assert.Equal(OrderStatus.Pending, order.Status);
    }

    [Fact]
    public void Submit_WithoutItems_ShouldThrowException()
    {
        // Arrange
        var order = new Order(_customerId);

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => order.Submit());
    }

    [Fact]
    public void Submit_FromNonDraftStatus_ShouldThrowException()
    {
        // Arrange
        var order = new Order(_customerId);
        order.AddItem(_testItem);
        order.Submit();

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => order.Submit());
    }

    [Fact]
    public void Approve_FromPendingStatus_ShouldChangeToApproved()
    {
        // Arrange
        var order = new Order(_customerId);
        order.AddItem(_testItem);
        order.Submit();

        // Act
        order.Approve();

        // Assert
        Assert.Equal(OrderStatus.Approved, order.Status);
    }

    [Fact]
    public void Approve_FromNonPendingStatus_ShouldThrowException()
    {
        // Arrange
        var order = new Order(_customerId);

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => order.Approve());
    }

    [Fact]
    public void Cancel_FromDraftOrPending_ShouldChangeToCancelled()
    {
        // Arrange
        var order = new Order(_customerId);
        order.AddItem(_testItem);

        // Act
        order.Cancel();

        // Assert
        Assert.Equal(OrderStatus.Cancelled, order.Status);
    }

    [Fact]
    public void Cancel_FromCompletedStatus_ShouldThrowException()
    {
        // Arrange
        var order = new Order(_customerId);
        order.AddItem(_testItem);
        order.Submit();
        order.Approve();
        order.Complete();

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => order.Cancel());
    }

    [Fact]
    public void CanCancel_ShouldReturnTrueForDraftAndPending()
    {
        // Arrange
        var draftOrder = new Order(_customerId);
        var pendingOrder = new Order(_customerId);
        pendingOrder.AddItem(_testItem);
        pendingOrder.Submit();

        // Act & Assert
        Assert.True(draftOrder.CanCancel());
        Assert.True(pendingOrder.CanCancel());
    }

    [Fact]
    public void CanCancel_ShouldReturnFalseForOtherStatuses()
    {
        // Arrange
        var order = new Order(_customerId);
        order.AddItem(_testItem);
        order.Submit();
        order.Approve();

        // Act & Assert
        Assert.False(order.CanCancel());
    }

    [Fact]
    public void GetTotalItemCount_ShouldReturnSumOfAllQuantities()
    {
        // Arrange
        var order = new Order(_customerId);
        var geometry = new Circle(new Point(10, 10), 5);
        var item1 = new OrderItem(order.Id, Guid.NewGuid(), geometry, 2, new Money(25.00m));
        var item2 = new OrderItem(order.Id, Guid.NewGuid(), geometry, 3, new Money(30.00m));

        order.AddItem(item1);
        order.AddItem(item2);

        // Act
        var totalCount = order.GetTotalItemCount();

        // Assert
        Assert.Equal(5, totalCount);
    }

    [Fact]
    public void HasMaterial_WithExistingMaterial_ShouldReturnTrue()
    {
        // Arrange
        var order = new Order(_customerId);
        order.AddItem(_testItem);

        // Act
        var hasMaterial = order.HasMaterial(_testMaterial.Id);

        // Assert
        Assert.True(hasMaterial);
    }

    [Fact]
    public void HasMaterial_WithNonExistingMaterial_ShouldReturnFalse()
    {
        // Arrange
        var order = new Order(_customerId);
        var nonExistingMaterialId = Guid.NewGuid();

        // Act
        var hasMaterial = order.HasMaterial(nonExistingMaterialId);

        // Assert
        Assert.False(hasMaterial);
    }
}