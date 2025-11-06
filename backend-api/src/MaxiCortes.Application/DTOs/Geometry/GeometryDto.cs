using System.Text.Json;
using System.Text.Json.Serialization;

namespace MaxiCortes.Application.DTOs.Orders;

[JsonConverter(typeof(GeometryDtoJsonConverter))]
public abstract class GeometryDto
{
    public abstract string Type { get; }
}

public class PolygonDto : GeometryDto
{
    public override string Type => "polygon";
    public List<PointDto> Points { get; set; } = new();
}

public class CircleDto : GeometryDto
{
    public override string Type => "circle";
    public PointDto Center { get; set; } = null!;
    public decimal Radius { get; set; }
}

public class OvalDto : GeometryDto
{
    public override string Type => "oval";
    public PointDto Center { get; set; } = null!;
    public decimal RadiusX { get; set; }
    public decimal RadiusY { get; set; }
}

public class PointDto
{
    public decimal X { get; set; }
    public decimal Y { get; set; }
}

// JSON Converter for GeometryDto
public class GeometryDtoJsonConverter : JsonConverter<GeometryDto>
{
    public override GeometryDto Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        using var doc = JsonDocument.ParseValue(ref reader);
        var root = doc.RootElement;

        if (!root.TryGetProperty("type", out var typeElement))
            throw new JsonException("Geometry must have a 'type' property");

        var type = typeElement.GetString()?.ToLowerInvariant();

        return type switch
        {
            "polygon" => JsonSerializer.Deserialize<PolygonDto>(root.GetRawText(), options)!,
            "circle" => JsonSerializer.Deserialize<CircleDto>(root.GetRawText(), options)!,
            "oval" => JsonSerializer.Deserialize<OvalDto>(root.GetRawText(), options)!,
            _ => throw new JsonException($"Unknown geometry type: {type}")
        };
    }

    public override void Write(Utf8JsonWriter writer, GeometryDto value, JsonSerializerOptions options)
    {
        JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }
}