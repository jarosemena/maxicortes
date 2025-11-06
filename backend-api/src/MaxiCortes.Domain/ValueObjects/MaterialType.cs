namespace MaxiCortes.Domain.ValueObjects;

public enum MaterialType
{
    Wood = 1,
    Metal = 2,
    Glass = 3
}

public static class MaterialTypeExtensions
{
    public static string ToDisplayString(this MaterialType type)
    {
        return type switch
        {
            MaterialType.Wood => "Wood",
            MaterialType.Metal => "Metal",
            MaterialType.Glass => "Glass",
            _ => throw new ArgumentOutOfRangeException(nameof(type), type, null)
        };
    }

    public static MaterialType FromString(string typeString)
    {
        return typeString?.ToLowerInvariant() switch
        {
            "wood" => MaterialType.Wood,
            "metal" => MaterialType.Metal,
            "glass" => MaterialType.Glass,
            _ => throw new ArgumentException($"Invalid material type: {typeString}", nameof(typeString))
        };
    }
}