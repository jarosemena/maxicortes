using MaxiCortes.Domain.ValueObjects;
using Xunit;

namespace MaxiCortes.Domain.Tests.ValueObjects;

public class GeometryTests
{
    [Fact]
    public void Circle_Constructor_ShouldCreateValidCircle()
    {
        // Arrange
        var center = new Point(10, 20);
        var radius = 5.5m;

        // Act
        var circle = new Circle(center, radius);

        // Assert
        Assert.Equal(GeometryType.Circle, circle.Type);
        Assert.Equal(center, circle.Center);
        Assert.Equal(5.5m, circle.Radius);
    }

    [Fact]
    public void Circle_WithNegativeRadius_ShouldThrowException()
    {
        // Arrange
        var center = new Point(10, 20);

        // Act & Assert
        Assert.Throws<ArgumentException>(() => new Circle(center, -1));
    }

    [Fact]
    public void Circle_CalculateArea_ShouldReturnCorrectArea()
    {
        // Arrange
        var circle = new Circle(new Point(0, 0), 10);

        // Act
        var area = circle.CalculateArea();

        // Assert
        Assert.Equal((decimal)Math.PI * 100, area);
    }

    [Fact]
    public void Circle_FitsInDimensions_ShouldReturnCorrectResult()
    {
        // Arrange
        var circle = new Circle(new Point(0, 0), 5);
        var validDimensions = new Dimensions(15, 15, 1);
        var invalidDimensions = new Dimensions(8, 8, 1);

        // Act & Assert
        Assert.True(circle.FitsInDimensions(validDimensions));
        Assert.False(circle.FitsInDimensions(invalidDimensions));
    }

    [Fact]
    public void Polygon_Constructor_ShouldCreateValidPolygon()
    {
        // Arrange
        var points = new[]
        {
            new Point(0, 0),
            new Point(10, 0),
            new Point(10, 10),
            new Point(0, 10)
        };

        // Act
        var polygon = new Polygon(points);

        // Assert
        Assert.Equal(GeometryType.Polygon, polygon.Type);
        Assert.Equal(4, polygon.Points.Count);
        Assert.Equal(points, polygon.Points);
    }

    [Fact]
    public void Polygon_WithLessThanThreePoints_ShouldThrowException()
    {
        // Arrange
        var points = new[]
        {
            new Point(0, 0),
            new Point(10, 0)
        };

        // Act & Assert
        Assert.Throws<ArgumentException>(() => new Polygon(points));
    }

    [Fact]
    public void Polygon_CalculateArea_ShouldReturnCorrectArea()
    {
        // Arrange - Square with side length 10
        var points = new[]
        {
            new Point(0, 0),
            new Point(10, 0),
            new Point(10, 10),
            new Point(0, 10)
        };
        var polygon = new Polygon(points);

        // Act
        var area = polygon.CalculateArea();

        // Assert
        Assert.Equal(100m, area);
    }

    [Fact]
    public void Polygon_FitsInDimensions_ShouldReturnCorrectResult()
    {
        // Arrange
        var points = new[]
        {
            new Point(0, 0),
            new Point(5, 0),
            new Point(5, 8),
            new Point(0, 8)
        };
        var polygon = new Polygon(points);
        var validDimensions = new Dimensions(10, 10, 1);
        var invalidDimensions = new Dimensions(4, 10, 1);

        // Act & Assert
        Assert.True(polygon.FitsInDimensions(validDimensions));
        Assert.False(polygon.FitsInDimensions(invalidDimensions));
    }

    [Fact]
    public void Oval_Constructor_ShouldCreateValidOval()
    {
        // Arrange
        var center = new Point(5, 5);
        var radiusX = 3m;
        var radiusY = 4m;

        // Act
        var oval = new Oval(center, radiusX, radiusY);

        // Assert
        Assert.Equal(GeometryType.Oval, oval.Type);
        Assert.Equal(center, oval.Center);
        Assert.Equal(3m, oval.RadiusX);
        Assert.Equal(4m, oval.RadiusY);
    }

    [Fact]
    public void Oval_WithNegativeRadius_ShouldThrowException()
    {
        // Arrange
        var center = new Point(5, 5);

        // Act & Assert
        Assert.Throws<ArgumentException>(() => new Oval(center, -1, 4));
        Assert.Throws<ArgumentException>(() => new Oval(center, 3, -1));
    }

    [Fact]
    public void Oval_CalculateArea_ShouldReturnCorrectArea()
    {
        // Arrange
        var oval = new Oval(new Point(0, 0), 3, 4);

        // Act
        var area = oval.CalculateArea();

        // Assert
        Assert.Equal((decimal)Math.PI * 3 * 4, area);
    }

    [Fact]
    public void Oval_FitsInDimensions_ShouldReturnCorrectResult()
    {
        // Arrange
        var oval = new Oval(new Point(0, 0), 3, 4); // 6x8 total size
        var validDimensions = new Dimensions(10, 10, 1);
        var invalidDimensions = new Dimensions(5, 10, 1);

        // Act & Assert
        Assert.True(oval.FitsInDimensions(validDimensions));
        Assert.False(oval.FitsInDimensions(invalidDimensions));
    }

    [Fact]
    public void Geometry_ToJson_AndFromJson_ShouldRoundTrip()
    {
        // Arrange
        var circle = new Circle(new Point(10, 20), 5);
        var polygon = new Polygon(new[]
        {
            new Point(0, 0),
            new Point(10, 0),
            new Point(5, 10)
        });
        var oval = new Oval(new Point(5, 5), 3, 4);

        // Act & Assert - Circle
        var circleJson = circle.ToJson();
        var circleFromJson = Geometry.FromJson(circleJson);
        Assert.Equal(circle, circleFromJson);

        // Act & Assert - Polygon
        var polygonJson = polygon.ToJson();
        var polygonFromJson = Geometry.FromJson(polygonJson);
        Assert.Equal(polygon, polygonFromJson);

        // Act & Assert - Oval
        var ovalJson = oval.ToJson();
        var ovalFromJson = Geometry.FromJson(ovalJson);
        Assert.Equal(oval, ovalFromJson);
    }

    [Fact]
    public void Geometry_Equality_ShouldWorkCorrectly()
    {
        // Arrange
        var circle1 = new Circle(new Point(10, 20), 5);
        var circle2 = new Circle(new Point(10, 20), 5);
        var circle3 = new Circle(new Point(10, 20), 6);

        // Act & Assert
        Assert.Equal(circle1, circle2);
        Assert.NotEqual(circle1, circle3);
        Assert.True(circle1.Equals(circle2));
        Assert.False(circle1.Equals(circle3));
    }
}