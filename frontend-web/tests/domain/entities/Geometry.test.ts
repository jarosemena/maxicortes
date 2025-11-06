import { describe, it, expect } from 'vitest';
import { 
  Geometry, 
  GeometryType, 
  Point, 
  PolygonGeometry, 
  CircleGeometry, 
  OvalGeometry 
} from '@/domain/entities/Geometry';

describe('Geometry Entity', () => {
  describe('Point', () => {
    it('should create a point with valid coordinates', () => {
      const point = new Point(10, 20);
      expect(point.x).toBe(10);
      expect(point.y).toBe(20);
    });

    it('should calculate distance to another point', () => {
      const point1 = new Point(0, 0);
      const point2 = new Point(3, 4);
      expect(point1.distanceTo(point2)).toBe(5);
    });
  });

  describe('PolygonGeometry', () => {
    it('should create a polygon with valid points', () => {
      const points = [
        new Point(0, 0),
        new Point(100, 0),
        new Point(100, 100),
        new Point(0, 100),
      ];
      
      const polygon = new PolygonGeometry(points);
      expect(polygon.type).toBe(GeometryType.POLYGON);
      expect(polygon.points).toEqual(points);
    });

    it('should throw error for less than 3 points', () => {
      const points = [new Point(0, 0), new Point(100, 0)];
      
      expect(() => {
        new PolygonGeometry(points);
      }).toThrow('Polygon must have at least 3 points');
    });

    it('should calculate area correctly for rectangle', () => {
      const points = [
        new Point(0, 0),
        new Point(100, 0),
        new Point(100, 50),
        new Point(0, 50),
      ];
      
      const polygon = new PolygonGeometry(points);
      expect(polygon.calculateArea()).toBe(5000); // 100 * 50 = 5000 mm²
    });

    it('should calculate perimeter correctly', () => {
      const points = [
        new Point(0, 0),
        new Point(100, 0),
        new Point(100, 50),
        new Point(0, 50),
      ];
      
      const polygon = new PolygonGeometry(points);
      expect(polygon.calculatePerimeter()).toBe(300); // 2 * (100 + 50) = 300 mm
    });
  });

  describe('CircleGeometry', () => {
    it('should create a circle with valid radius', () => {
      const circle = new CircleGeometry(50);
      expect(circle.type).toBe(GeometryType.CIRCLE);
      expect(circle.radius).toBe(50);
    });

    it('should throw error for negative radius', () => {
      expect(() => {
        new CircleGeometry(-10);
      }).toThrow('Radius must be positive');
    });

    it('should calculate area correctly', () => {
      const circle = new CircleGeometry(10);
      const expectedArea = Math.PI * 10 * 10;
      expect(circle.calculateArea()).toBeCloseTo(expectedArea, 2);
    });

    it('should calculate perimeter correctly', () => {
      const circle = new CircleGeometry(10);
      const expectedPerimeter = 2 * Math.PI * 10;
      expect(circle.calculatePerimeter()).toBeCloseTo(expectedPerimeter, 2);
    });
  });

  describe('OvalGeometry', () => {
    it('should create an oval with valid dimensions', () => {
      const oval = new OvalGeometry(100, 50);
      expect(oval.type).toBe(GeometryType.OVAL);
      expect(oval.width).toBe(100);
      expect(oval.height).toBe(50);
    });

    it('should throw error for negative dimensions', () => {
      expect(() => {
        new OvalGeometry(-100, 50);
      }).toThrow('Width must be positive');

      expect(() => {
        new OvalGeometry(100, -50);
      }).toThrow('Height must be positive');
    });

    it('should calculate area correctly', () => {
      const oval = new OvalGeometry(20, 10);
      const expectedArea = Math.PI * 10 * 5; // π * a * b where a=width/2, b=height/2
      expect(oval.calculateArea()).toBeCloseTo(expectedArea, 2);
    });

    it('should calculate approximate perimeter', () => {
      const oval = new OvalGeometry(20, 10);
      const a = 10; // semi-major axis
      const b = 5;  // semi-minor axis
      // Ramanujan's approximation: π * (3(a+b) - √((3a+b)(a+3b)))
      const expectedPerimeter = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
      expect(oval.calculatePerimeter()).toBeCloseTo(expectedPerimeter, 1);
    });
  });
});