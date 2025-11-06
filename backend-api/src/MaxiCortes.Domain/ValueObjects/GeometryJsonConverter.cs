using System.Text.Json;
using System.Text.Json.Serialization;

namespace MaxiCortes.Domain.ValueObjects;

public class GeometryJsonConverter : JsonConverter<Geometry>
{
    public override Geometry Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using var doc = JsonDocument.ParseValue(ref reader);
        var root = doc.RootElement;

        if (!root.TryGetProperty("type", out var typeElement))
            throw new JsonException("Geometry JSON must have a 'type' property");

        var type = typeElement.GetString()?.ToLowerInvariant();

        return type switch
        {
            "polygon" => ReadPolygon(root),
            "circle" => ReadCircle(root),
            "oval" => ReadOval(root),
            _ => throw new JsonException($"Unknown geometry type: {type}")
        };
    }

    public override void Write(Utf8JsonWriter writer, Geometry value, JsonSerializerOptions options)
    {
        var json = value.ToJson();
        using var doc = JsonDocument.Parse(json);
        doc.WriteTo(writer);
    }

    private static Polygon ReadPolygon(JsonElement root)
    {
        if (!root.TryGetProperty("points", out var pointsElement))
            throw new JsonException("Polygon must have 'points' property");

        var points = new List<Point>();
        foreach (var pointElement in pointsElement.EnumerateArray())
        {
            if (!pointElement.TryGetProperty("x", out var xElement) ||
                !pointElement.TryGetProperty("y", out var yElement))
                throw new JsonException("Point must have 'x' and 'y' properties");

            var x = xElement.GetDecimal();
            var y = yElement.GetDecimal();
            points.Add(new Point(x, y));
        }

        return new Polygon(points);
    }

    private static Circle ReadCircle(JsonElement root)
    {
        if (!root.TryGetProperty("center", out var centerElement))
            throw new JsonException("Circle must have 'center' property");

        if (!root.TryGetProperty("radius", out var radiusElement))
            throw new JsonException("Circle must have 'radius' property");

        var center = ReadPoint(centerElement);
        var radius = radiusElement.GetDecimal();

        return new Circle(center, radius);
    }

    private static Oval ReadOval(JsonElement root)
    {
        if (!root.TryGetProperty("center", out var centerElement))
            throw new JsonException("Oval must have 'center' property");

        if (!root.TryGetProperty("radiusX", out var radiusXElement))
            throw new JsonException("Oval must have 'radiusX' property");

        if (!root.TryGetProperty("radiusY", out var radiusYElement))
            throw new JsonException("Oval must have 'radiusY' property");

        var center = ReadPoint(centerElement);
        var radiusX = radiusXElement.GetDecimal();
        var radiusY = radiusYElement.GetDecimal();

        return new Oval(center, radiusX, radiusY);
    }

    private static Point ReadPoint(JsonElement pointElement)
    {
        if (!pointElement.TryGetProperty("x", out var xElement) ||
            !pointElement.TryGetProperty("y", out var yElement))
            throw new JsonException("Point must have 'x' and 'y' properties");

        var x = xElement.GetDecimal();
        var y = yElement.GetDecimal();
        return new Point(x, y);
    }
}