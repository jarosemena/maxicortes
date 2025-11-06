using System.Text.Json;
using System.Text.Json.Serialization;

namespace MaxiCortes.Domain.ValueObjects;

[JsonConverter(typeof(GeometryJsonConverter))]
public abstract class Geometry : IEquatable<Geometry>
{
    public abstract GeometryType Type { get; }
    public abstract decimal CalculateArea();
    public abstract bool FitsInDimensions(Dimensions dimensions);
    public abstract string ToJson();

    public static Geometry FromJson(string json)
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            Converters = { new GeometryJsonConverter() }
        };

        return JsonSerializer.Deserialize<Geometry>(json, options) 
            ?? throw new ArgumentException("Invalid geometry JSON", nameof(json));
    }

    public abstract bool Equals(Geometry? other);
    public abstract override bool Equals(object? obj);
    public abstract override int GetHashCode();
}

public enum GeometryType
{
    Polygon = 1,
    Circle = 2,
    Oval = 3
}

public class Polygon : Geometry
{
    public override GeometryType Type => GeometryType.Polygon;
    public IReadOnlyList<Point> Points { get; }

    public Polygon(IEnumerable<Point> points)
    {
        var pointList = points?.ToList() ?? throw new ArgumentNullException(nameof(points));
        
        if (pointList.Count < 3)
            throw new ArgumentException("Polygon must have at least 3 points", nameof(points));

        if (!IsValidPolygon(pointList))
            throw new ArgumentException("Invalid polygon: points must form a valid shape", nameof(points));

        Points = pointList.AsReadOnly();
    }

    public override decimal CalculateArea()
    {
        // Shoelace formula for polygon area
        decimal area = 0;
        int n = Points.Count;

        for (int i = 0; i < n; i++)
        {
            int j = (i + 1) % n;
            area += Points[i].X * Points[j].Y;
            area -= Points[j].X * Points[i].Y;
        }

        return Math.Abs(area) / 2;
    }

    public override bool FitsInDimensions(Dimensions dimensions)
    {
        var minX = Points.Min(p => p.X);
        var maxX = Points.Max(p => p.X);
        var minY = Points.Min(p => p.Y);
        var maxY = Points.Max(p => p.Y);

        var width = maxX - minX;
        var height = maxY - minY;

        return width <= dimensions.Width && height <= dimensions.Height;
    }

    public override string ToJson()
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        return JsonSerializer.Serialize(new
        {
            Type = "polygon",
            Points = Points.Select(p => new { p.X, p.Y })
        }, options);
    }

    private static bool IsValidPolygon(List<Point> points)
    {
        // Basic validation: check for duplicate consecutive points
        for (int i = 0; i < points.Count; i++)
        {
            int next = (i + 1) % points.Count;
            if (points[i].Equals(points[next]))
                return false;
        }

        // Check if area is positive (not self-intersecting in simple cases)
        return CalculateSignedArea(points) != 0;
    }

    private static decimal CalculateSignedArea(List<Point> points)
    {
        decimal area = 0;
        int n = points.Count;

        for (int i = 0; i < n; i++)
        {
            int j = (i + 1) % n;
            area += points[i].X * points[j].Y;
            area -= points[j].X * points[i].Y;
        }

        return area / 2;
    }

    public override bool Equals(Geometry? other)
    {
        return other is Polygon polygon && 
               Points.Count == polygon.Points.Count &&
               Points.SequenceEqual(polygon.Points);
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as Geometry);
    }

    public override int GetHashCode()
    {
        return Points.Aggregate(0, (hash, point) => HashCode.Combine(hash, point.GetHashCode()));
    }
}

public class Circle : Geometry
{
    public override GeometryType Type => GeometryType.Circle;
    public Point Center { get; }
    public decimal Radius { get; }

    public Circle(Point center, decimal radius)
    {
        if (radius <= 0)
            throw new ArgumentException("Radius must be positive", nameof(radius));

        Center = center ?? throw new ArgumentNullException(nameof(center));
        Radius = Math.Round(radius, 4);
    }

    public override decimal CalculateArea()
    {
        return (decimal)Math.PI * Radius * Radius;
    }

    public override bool FitsInDimensions(Dimensions dimensions)
    {
        var diameter = Radius * 2;
        return diameter <= dimensions.Width && diameter <= dimensions.Height;
    }

    public override string ToJson()
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        return JsonSerializer.Serialize(new
        {
            Type = "circle",
            Center = new { Center.X, Center.Y },
            Radius
        }, options);
    }

    public override bool Equals(Geometry? other)
    {
        return other is Circle circle && 
               Center.Equals(circle.Center) && 
               Radius == circle.Radius;
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as Geometry);
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Center, Radius);
    }
}

public class Oval : Geometry
{
    public override GeometryType Type => GeometryType.Oval;
    public Point Center { get; }
    public decimal RadiusX { get; }
    public decimal RadiusY { get; }

    public Oval(Point center, decimal radiusX, decimal radiusY)
    {
        if (radiusX <= 0)
            throw new ArgumentException("RadiusX must be positive", nameof(radiusX));
        
        if (radiusY <= 0)
            throw new ArgumentException("RadiusY must be positive", nameof(radiusY));

        Center = center ?? throw new ArgumentNullException(nameof(center));
        RadiusX = Math.Round(radiusX, 4);
        RadiusY = Math.Round(radiusY, 4);
    }

    public override decimal CalculateArea()
    {
        return (decimal)Math.PI * RadiusX * RadiusY;
    }

    public override bool FitsInDimensions(Dimensions dimensions)
    {
        var width = RadiusX * 2;
        var height = RadiusY * 2;
        return width <= dimensions.Width && height <= dimensions.Height;
    }

    public override string ToJson()
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        return JsonSerializer.Serialize(new
        {
            Type = "oval",
            Center = new { Center.X, Center.Y },
            RadiusX,
            RadiusY
        }, options);
    }

    public override bool Equals(Geometry? other)
    {
        return other is Oval oval && 
               Center.Equals(oval.Center) && 
               RadiusX == oval.RadiusX && 
               RadiusY == oval.RadiusY;
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as Geometry);
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Center, RadiusX, RadiusY);
    }
}