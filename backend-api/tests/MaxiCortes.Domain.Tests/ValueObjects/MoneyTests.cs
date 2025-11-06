using FluentAssertions;
using MaxiCortes.Domain.ValueObjects;

namespace MaxiCortes.Domain.Tests.ValueObjects;

public class MoneyTests
{
    [Fact]
    public void Constructor_WithValidAmount_ShouldCreateMoney()
    {
        // Arrange & Act
        var money = new Money(100.50m, "USD");

        // Assert
        money.Amount.Should().Be(100.50m);
        money.Currency.Should().Be("USD");
    }

    [Fact]
    public void Constructor_WithDefaultCurrency_ShouldUseUSD()
    {
        // Arrange & Act
        var money = new Money(50.00m);

        // Assert
        money.Currency.Should().Be("USD");
    }

    [Fact]
    public void Constructor_WithNegativeAmount_ShouldThrowArgumentException()
    {
        // Act & Assert
        var act = () => new Money(-10.00m);
        act.Should().Throw<ArgumentException>()
           .WithMessage("Amount cannot be negative*");
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void Constructor_WithInvalidCurrency_ShouldThrowArgumentException(string invalidCurrency)
    {
        // Act & Assert
        var act = () => new Money(100.00m, invalidCurrency);
        act.Should().Throw<ArgumentException>()
           .WithMessage("Currency cannot be empty*");
    }

    [Fact]
    public void Constructor_ShouldRoundAmountToTwoDecimals()
    {
        // Arrange & Act
        var money = new Money(100.999m);

        // Assert
        money.Amount.Should().Be(101.00m);
    }

    [Fact]
    public void Constructor_ShouldNormalizeCurrencyToUpperCase()
    {
        // Arrange & Act
        var money = new Money(100.00m, "eur");

        // Assert
        money.Currency.Should().Be("EUR");
    }

    [Fact]
    public void Add_WithSameCurrency_ShouldReturnSum()
    {
        // Arrange
        var money1 = new Money(100.50m, "USD");
        var money2 = new Money(50.25m, "USD");

        // Act
        var result = money1.Add(money2);

        // Assert
        result.Amount.Should().Be(150.75m);
        result.Currency.Should().Be("USD");
    }

    [Fact]
    public void Add_WithDifferentCurrency_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var money1 = new Money(100.00m, "USD");
        var money2 = new Money(50.00m, "EUR");

        // Act & Assert
        var act = () => money1.Add(money2);
        act.Should().Throw<InvalidOperationException>()
           .WithMessage("Cannot operate on different currencies: USD and EUR");
    }

    [Fact]
    public void Subtract_WithSameCurrency_ShouldReturnDifference()
    {
        // Arrange
        var money1 = new Money(100.50m, "USD");
        var money2 = new Money(30.25m, "USD");

        // Act
        var result = money1.Subtract(money2);

        // Assert
        result.Amount.Should().Be(70.25m);
        result.Currency.Should().Be("USD");
    }

    [Fact]
    public void Multiply_WithPositiveFactor_ShouldReturnProduct()
    {
        // Arrange
        var money = new Money(100.00m, "USD");

        // Act
        var result = money.Multiply(2.5m);

        // Assert
        result.Amount.Should().Be(250.00m);
        result.Currency.Should().Be("USD");
    }

    [Fact]
    public void Multiply_WithNegativeFactor_ShouldThrowArgumentException()
    {
        // Arrange
        var money = new Money(100.00m, "USD");

        // Act & Assert
        var act = () => money.Multiply(-2.0m);
        act.Should().Throw<ArgumentException>()
           .WithMessage("Factor cannot be negative*");
    }

    [Fact]
    public void Divide_WithPositiveDivisor_ShouldReturnQuotient()
    {
        // Arrange
        var money = new Money(100.00m, "USD");

        // Act
        var result = money.Divide(4.0m);

        // Assert
        result.Amount.Should().Be(25.00m);
        result.Currency.Should().Be("USD");
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-2.0)]
    public void Divide_WithInvalidDivisor_ShouldThrowArgumentException(decimal divisor)
    {
        // Arrange
        var money = new Money(100.00m, "USD");

        // Act & Assert
        var act = () => money.Divide(divisor);
        act.Should().Throw<ArgumentException>()
           .WithMessage("Divisor must be positive*");
    }

    [Fact]
    public void Equals_WithSameAmountAndCurrency_ShouldReturnTrue()
    {
        // Arrange
        var money1 = new Money(100.00m, "USD");
        var money2 = new Money(100.00m, "USD");

        // Act & Assert
        money1.Equals(money2).Should().BeTrue();
        (money1 == money2).Should().BeTrue();
    }

    [Fact]
    public void Equals_WithDifferentAmount_ShouldReturnFalse()
    {
        // Arrange
        var money1 = new Money(100.00m, "USD");
        var money2 = new Money(200.00m, "USD");

        // Act & Assert
        money1.Equals(money2).Should().BeFalse();
        (money1 != money2).Should().BeTrue();
    }

    [Fact]
    public void Equals_WithDifferentCurrency_ShouldReturnFalse()
    {
        // Arrange
        var money1 = new Money(100.00m, "USD");
        var money2 = new Money(100.00m, "EUR");

        // Act & Assert
        money1.Equals(money2).Should().BeFalse();
    }

    [Fact]
    public void ToString_ShouldReturnFormattedString()
    {
        // Arrange
        var money = new Money(100.50m, "USD");

        // Act
        var result = money.ToString();

        // Assert
        result.Should().Be("100.50 USD");
    }

    [Fact]
    public void OperatorOverloads_ShouldWorkCorrectly()
    {
        // Arrange
        var money1 = new Money(100.00m, "USD");
        var money2 = new Money(50.00m, "USD");

        // Act & Assert
        (money1 + money2).Amount.Should().Be(150.00m);
        (money1 - money2).Amount.Should().Be(50.00m);
        (money1 * 2).Amount.Should().Be(200.00m);
        (money1 / 2).Amount.Should().Be(50.00m);
    }
}