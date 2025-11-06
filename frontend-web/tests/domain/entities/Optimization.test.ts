import { describe, it, expect } from 'vitest';
import { 
  Optimization, 
  OptimizationStatus, 
  OptimizationResult, 
  PlacedPiece, 
  OptimizationMetrics 
} from '@/domain/entities/Optimization';
import { Point } from '@/domain/entities/Geometry';

describe('Optimization Entity', () => {
  describe('PlacedPiece', () => {
    it('should create a placed piece with valid properties', () => {
      const placedPiece = new PlacedPiece({
        id: 'piece-001',
        orderItemId: 'item-001',
        position: new Point(100, 200),
        rotation: 45,
        isFlipped: false,
      });

      expect(placedPiece.id).toBe('piece-001');
      expect(placedPiece.orderItemId).toBe('item-001');
      expect(placedPiece.position).toEqual(new Point(100, 200));
      expect(placedPiece.rotation).toBe(45);
      expect(placedPiece.isFlipped).toBe(false);
    });

    it('should normalize rotation to 0-360 range', () => {
      const placedPiece = new PlacedPiece({
        id: 'piece-001',
        orderItemId: 'item-001',
        position: new Point(0, 0),
        rotation: 450, // Should become 90
        isFlipped: false,
      });

      expect(placedPiece.rotation).toBe(90);
    });

    it('should handle negative rotation', () => {
      const placedPiece = new PlacedPiece({
        id: 'piece-001',
        orderItemId: 'item-001',
        position: new Point(0, 0),
        rotation: -90, // Should become 270
        isFlipped: false,
      });

      expect(placedPiece.rotation).toBe(270);
    });
  });

  describe('OptimizationMetrics', () => {
    it('should create metrics with valid properties', () => {
      const metrics = new OptimizationMetrics({
        materialUtilization: 85.5,
        wastePercentage: 14.5,
        totalArea: 2000000, // 2 m² in mm²
        usedArea: 1710000,  // 1.71 m² in mm²
        wasteArea: 290000,  // 0.29 m² in mm²
        numberOfSheets: 3,
        estimatedCost: 150.75,
        processingTimeMs: 5000,
      });

      expect(metrics.materialUtilization).toBe(85.5);
      expect(metrics.wastePercentage).toBe(14.5);
      expect(metrics.totalArea).toBe(2000000);
      expect(metrics.usedArea).toBe(1710000);
      expect(metrics.wasteArea).toBe(290000);
      expect(metrics.numberOfSheets).toBe(3);
      expect(metrics.estimatedCost).toBe(150.75);
      expect(metrics.processingTimeMs).toBe(5000);
    });

    it('should throw error for invalid utilization percentage', () => {
      expect(() => {
        new OptimizationMetrics({
          materialUtilization: 150, // Invalid > 100
          wastePercentage: 14.5,
          totalArea: 2000000,
          usedArea: 1710000,
          wasteArea: 290000,
          numberOfSheets: 3,
          estimatedCost: 150.75,
          processingTimeMs: 5000,
        });
      }).toThrow('Material utilization must be between 0 and 100');
    });

    it('should calculate efficiency score correctly', () => {
      const metrics = new OptimizationMetrics({
        materialUtilization: 85.5,
        wastePercentage: 14.5,
        totalArea: 2000000,
        usedArea: 1710000,
        wasteArea: 290000,
        numberOfSheets: 3,
        estimatedCost: 150.75,
        processingTimeMs: 5000,
      });

      // Efficiency score = (utilization * 0.7) + ((100 - waste) * 0.3)
      const expectedScore = (85.5 * 0.7) + ((100 - 14.5) * 0.3);
      expect(metrics.calculateEfficiencyScore()).toBeCloseTo(expectedScore, 2);
    });
  });

  describe('OptimizationResult', () => {
    it('should create a result with valid properties', () => {
      const placedPieces = [
        new PlacedPiece({
          id: 'piece-001',
          orderItemId: 'item-001',
          position: new Point(0, 0),
          rotation: 0,
          isFlipped: false,
        }),
      ];

      const metrics = new OptimizationMetrics({
        materialUtilization: 85.5,
        wastePercentage: 14.5,
        totalArea: 2000000,
        usedArea: 1710000,
        wasteArea: 290000,
        numberOfSheets: 3,
        estimatedCost: 150.75,
        processingTimeMs: 5000,
      });

      const result = new OptimizationResult({
        id: 'result-001',
        materialId: 'mat-001',
        placedPieces,
        metrics,
        sheetIndex: 0,
      });

      expect(result.id).toBe('result-001');
      expect(result.materialId).toBe('mat-001');
      expect(result.placedPieces).toEqual(placedPieces);
      expect(result.metrics).toBe(metrics);
      expect(result.sheetIndex).toBe(0);
    });

    it('should throw error for negative sheet index', () => {
      const placedPieces = [
        new PlacedPiece({
          id: 'piece-001',
          orderItemId: 'item-001',
          position: new Point(0, 0),
          rotation: 0,
          isFlipped: false,
        }),
      ];

      const metrics = new OptimizationMetrics({
        materialUtilization: 85.5,
        wastePercentage: 14.5,
        totalArea: 2000000,
        usedArea: 1710000,
        wasteArea: 290000,
        numberOfSheets: 3,
        estimatedCost: 150.75,
        processingTimeMs: 5000,
      });

      expect(() => {
        new OptimizationResult({
          id: 'result-001',
          materialId: 'mat-001',
          placedPieces,
          metrics,
          sheetIndex: -1,
        });
      }).toThrow('Sheet index cannot be negative');
    });
  });

  describe('Optimization', () => {
    it('should create an optimization with valid properties', () => {
      const optimization = new Optimization({
        id: 'opt-001',
        orderId: 'order-001',
        status: OptimizationStatus.PENDING,
        results: [],
        createdAt: new Date('2023-01-01'),
      });

      expect(optimization.id).toBe('opt-001');
      expect(optimization.orderId).toBe('order-001');
      expect(optimization.status).toBe(OptimizationStatus.PENDING);
      expect(optimization.results).toEqual([]);
      expect(optimization.createdAt).toEqual(new Date('2023-01-01'));
    });

    it('should start optimization correctly', () => {
      const optimization = new Optimization({
        id: 'opt-001',
        orderId: 'order-001',
        status: OptimizationStatus.PENDING,
        results: [],
        createdAt: new Date(),
      });

      const startedOptimization = optimization.start();
      
      expect(startedOptimization.status).toBe(OptimizationStatus.RUNNING);
      expect(startedOptimization.startedAt).toBeDefined();
      expect(startedOptimization.updatedAt).toBeDefined();
    });

    it('should complete optimization with results', () => {
      const optimization = new Optimization({
        id: 'opt-001',
        orderId: 'order-001',
        status: OptimizationStatus.RUNNING,
        results: [],
        createdAt: new Date(),
        startedAt: new Date(),
      });

      const results = [
        new OptimizationResult({
          id: 'result-001',
          materialId: 'mat-001',
          placedPieces: [],
          metrics: new OptimizationMetrics({
            materialUtilization: 85.5,
            wastePercentage: 14.5,
            totalArea: 2000000,
            usedArea: 1710000,
            wasteArea: 290000,
            numberOfSheets: 3,
            estimatedCost: 150.75,
            processingTimeMs: 5000,
          }),
          sheetIndex: 0,
        }),
      ];

      const completedOptimization = optimization.complete(results);
      
      expect(completedOptimization.status).toBe(OptimizationStatus.COMPLETED);
      expect(completedOptimization.results).toEqual(results);
      expect(completedOptimization.completedAt).toBeDefined();
      expect(completedOptimization.updatedAt).toBeDefined();
    });

    it('should fail optimization with error', () => {
      const optimization = new Optimization({
        id: 'opt-001',
        orderId: 'order-001',
        status: OptimizationStatus.RUNNING,
        results: [],
        createdAt: new Date(),
        startedAt: new Date(),
      });

      const failedOptimization = optimization.fail('Optimization timeout');
      
      expect(failedOptimization.status).toBe(OptimizationStatus.FAILED);
      expect(failedOptimization.errorMessage).toBe('Optimization timeout');
      expect(failedOptimization.completedAt).toBeDefined();
      expect(failedOptimization.updatedAt).toBeDefined();
    });

    it('should calculate total processing time', () => {
      const startTime = new Date('2023-01-01T10:00:00Z');
      const endTime = new Date('2023-01-01T10:05:30Z'); // 5.5 minutes later

      const optimization = new Optimization({
        id: 'opt-001',
        orderId: 'order-001',
        status: OptimizationStatus.COMPLETED,
        results: [],
        createdAt: startTime,
        startedAt: startTime,
        completedAt: endTime,
      });

      expect(optimization.getTotalProcessingTimeMs()).toBe(330000); // 5.5 minutes in ms
    });

    it('should get best result by efficiency', () => {
      const result1 = new OptimizationResult({
        id: 'result-001',
        materialId: 'mat-001',
        placedPieces: [],
        metrics: new OptimizationMetrics({
          materialUtilization: 75.0,
          wastePercentage: 25.0,
          totalArea: 2000000,
          usedArea: 1500000,
          wasteArea: 500000,
          numberOfSheets: 3,
          estimatedCost: 150.75,
          processingTimeMs: 5000,
        }),
        sheetIndex: 0,
      });

      const result2 = new OptimizationResult({
        id: 'result-002',
        materialId: 'mat-002',
        placedPieces: [],
        metrics: new OptimizationMetrics({
          materialUtilization: 90.0,
          wastePercentage: 10.0,
          totalArea: 2000000,
          usedArea: 1800000,
          wasteArea: 200000,
          numberOfSheets: 2,
          estimatedCost: 120.50,
          processingTimeMs: 4000,
        }),
        sheetIndex: 0,
      });

      const optimization = new Optimization({
        id: 'opt-001',
        orderId: 'order-001',
        status: OptimizationStatus.COMPLETED,
        results: [result1, result2],
        createdAt: new Date(),
      });

      const bestResult = optimization.getBestResult();
      expect(bestResult).toBe(result2); // Higher efficiency score
    });
  });
});