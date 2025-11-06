export enum GeometryType {
  POLYGON = 'POLYGON',
  CIRCLE = 'CIRCLE',
  OVAL = 'OVAL',
}

export class Point {
  constructor(
    public readonly x: number,
    public readonly y: number
  ) {}

  public distanceTo(other: Point): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }
}

export abstract class Geometry {
  public abstract readonly type: GeometryType;
  
  public abstract calculateArea(): number;
  public abstract calculatePerimeter(): number;
  public abstract getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number };
}

export class PolygonGeometry extends Geometry {
  public readonly type = GeometryType.POLYGON;

  constructor(public readonly points: Point[]) {
    super();
    this.validatePoints(points);
  }

  private validatePoints(points: Point[]): void {
    if (points.length < 3) {
      throw new Error('Polygon must have at least 3 points');
    }
  }

  public calculateArea(): number {
    // Shoelace formula
    let area = 0;
    const n = this.points.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += this.points[i].x * this.points[j].y;
      area -= this.points[j].x * this.points[i].y;
    }
    
    return Math.abs(area) / 2;
  }

  public calculatePerimeter(): number {
    let perimeter = 0;
    const n = this.points.length;
    
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      perimeter += this.points[i].distanceTo(this.points[j]);
    }
    
    return perimeter;
  }

  public getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    if (this.points.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    let minX = this.points[0].x;
    let minY = this.points[0].y;
    let maxX = this.points[0].x;
    let maxY = this.points[0].y;

    for (const point of this.points) {
      minX = Math.min(minX, point.x);
      minY = Math.min(minY, point.y);
      maxX = Math.max(maxX, point.x);
      maxY = Math.max(maxY, point.y);
    }

    return { minX, minY, maxX, maxY };
  }
}

export class CircleGeometry extends Geometry {
  public readonly type = GeometryType.CIRCLE;

  constructor(public readonly radius: number) {
    super();
    this.validateRadius(radius);
  }

  private validateRadius(radius: number): void {
    if (radius <= 0) {
      throw new Error('Radius must be positive');
    }
  }

  public calculateArea(): number {
    return Math.PI * this.radius * this.radius;
  }

  public calculatePerimeter(): number {
    return 2 * Math.PI * this.radius;
  }

  public getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    return {
      minX: -this.radius,
      minY: -this.radius,
      maxX: this.radius,
      maxY: this.radius,
    };
  }
}

export class OvalGeometry extends Geometry {
  public readonly type = GeometryType.OVAL;

  constructor(
    public readonly width: number,
    public readonly height: number
  ) {
    super();
    this.validateDimensions(width, height);
  }

  private validateDimensions(width: number, height: number): void {
    if (width <= 0) {
      throw new Error('Width must be positive');
    }
    if (height <= 0) {
      throw new Error('Height must be positive');
    }
  }

  public calculateArea(): number {
    const a = this.width / 2;  // semi-major axis
    const b = this.height / 2; // semi-minor axis
    return Math.PI * a * b;
  }

  public calculatePerimeter(): number {
    const a = this.width / 2;  // semi-major axis
    const b = this.height / 2; // semi-minor axis
    
    // Ramanujan's approximation for ellipse perimeter
    const h = Math.pow((a - b) / (a + b), 2);
    return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
  }

  public getBoundingBox(): { minX: number; minY: number; maxX: number; maxY: number } {
    const halfWidth = this.width / 2;
    const halfHeight = this.height / 2;
    
    return {
      minX: -halfWidth,
      minY: -halfHeight,
      maxX: halfWidth,
      maxY: halfHeight,
    };
  }
}