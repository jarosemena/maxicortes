import { Optimization, OptimizationStatus } from '../entities/Optimization';

export interface IOptimizationRepository {
  /**
   * Find all optimizations
   */
  findAll(): Promise<Optimization[]>;

  /**
   * Find optimization by ID
   */
  findById(id: string): Promise<Optimization | null>;

  /**
   * Find optimizations by order ID
   */
  findByOrderId(orderId: string): Promise<Optimization[]>;

  /**
   * Find optimizations by status
   */
  findByStatus(status: OptimizationStatus): Promise<Optimization[]>;

  /**
   * Find latest optimization for an order
   */
  findLatestByOrderId(orderId: string): Promise<Optimization | null>;

  /**
   * Save optimization (create or update)
   */
  save(optimization: Optimization): Promise<Optimization>;

  /**
   * Delete optimization by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Update optimization status
   */
  updateStatus(id: string, status: OptimizationStatus): Promise<Optimization>;

  /**
   * Find running optimizations
   */
  findRunning(): Promise<Optimization[]>;

  /**
   * Find completed optimizations within date range
   */
  findCompletedInDateRange(startDate: Date, endDate: Date): Promise<Optimization[]>;

  /**
   * Get optimization statistics
   */
  getStatistics(): Promise<{
    total: number;
    byStatus: Record<OptimizationStatus, number>;
    averageProcessingTime: number;
    averageEfficiency: number;
  }>;

  /**
   * Find optimizations with best efficiency scores
   */
  findTopPerforming(limit?: number): Promise<Optimization[]>;
}