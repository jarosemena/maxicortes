namespace MaxiCortes.Domain.ValueObjects;

public class Point : IEquatable<Point>
{
    public decimal X { get; }
    public decimal Y { get; }

    public Point(decimal x, decimal y)
    {
        X = Math.Round(x, 4);
        Y = Math.Round(y, 4);
    }

    public decimal DistanceTo(Point other)
    {
        if (other == null)
            throw new ArgumentNullException(nameof(other));

        var deltaX = X - other.X;
        var deltaY = Y - other.Y;
        return (decimal)Math.Sqrt((double)(deltaX * deltaX + deltaY * deltaY));
    }

    public Point Translate(decimal deltaX, decimal deltaY)
    {
        return new Point(X + deltaX, Y + deltaY);
    }

    public bool Equals(Point? other)
    {
        if (other is null) return false;
        if (ReferenceEquals(this, other)) return true;
        return X == other.X && Y == other.Y;
    }

    public override bool Equals(object? obj)
    {
        return Equals(obj as Point);
    }

    public override int GetHashCode()
    {
        return HashCode.Combine(X, Y);
    }

    public override string ToString()
    {
        return $"({X}, {Y})";
    }

    public static bool operator ==(Point? left, Point? right)
    {
        return Equals(left, right);
    }

    public static bool operator !=(Point? left, Point? right)
    {
        return !Equals(left, right);
    }
}