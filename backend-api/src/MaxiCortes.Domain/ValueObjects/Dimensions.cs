namespace MaxiCortes.Domain.ValueObjects;

public class Dimensions : IEquatable<Dimensions>
{
    public decimal Width { get; }
    public decimal Height { get; }
    public decimal Thickness { get; }

    public Dimensions(decimal width, decimal height, decimal thickness)
    {
        if (width <= 0)
            throw new ArgumentException("Width must be positive", nameof(width));

        if (height <= 0)
            throw new ArgumentException("Height must be positive", nameof(height));

        if (thickness <= 0)
            throw new ArgumentException("Thickness must be positive", nameof(thickness));

        Width = Math.Round(width, 2);
        Height = Math.Round(height, 2);
        Thickness = Math.Round(thickness, 4);
    }

    public decimal CalculateArea()
    {
        return Width * Height;
    }

    public decimal CalculateVolume()
    {
        return Width * Height * Thickness;
    }

    public bool CanFit(Dimensions other)
    {
        if (other == null)
            throw new ArgumentNullException(nameof(other));

        return Width >= other.Width && 
               Height >= other.Height && 
               Thickness >= other.Thickness;
    }

    public bool Equals(Dimensions? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return Width == other.Width && 
               Height == other.Height && 
               Thickness == other.Thickness;
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as Dimensions);
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(Width, Height, Thickness);
    }

    public override string ToString()
    {
        return $"{Width} x {Height} x {Thickness}";
    }

    public static bool operator ==(Dimensions? left, Dimensions? right)
    {
        return Equals(left, right);
    }

    public static bool operator !=(Dimensions? left, Dimensions? right)
    {
        return !Equals(left, right);
    }
}