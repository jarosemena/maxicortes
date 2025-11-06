import { Point } from './Geometry';

export enum OptimizationStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export interface PlacedPieceProps {
  id: string;
  orderItemId: string;
  position: Point;
  rotation: number; // in degrees
  isFlipped: boolean;
}

export class PlacedPiece {
  public readonly id: string;
  public readonly orderItemId: string;
  public readonly position: Point;
  public readonly rotation: number;
  public readonly isFlipped: boolean;

  constructor(props: PlacedPieceProps) {
    this.id = props.id;
    this.orderItemId = props.orderItemId;
    this.position = props.position;
    this.rotation = this.normalizeRotation(props.rotation);
    this.isFlipped = props.isFlipped;
  }

  private normalizeRotation(rotation: number): number {
    // Normalize rotation to 0-360 range
    let normalized = rotation % 360;
    if (normalized < 0) {
      normalized += 360;
    }
    return normalized;
  }

  public toProps(): PlacedPieceProps {
    return {
      id: this.id,
      orderItemId: this.orderItemId,
      position: this.position,
      rotation: this.rotation,
      isFlipped: this.isFlipped,
    };
  }
}

export interface OptimizationMetricsProps {
  materialUtilization: number; // percentage 0-100
  wastePercentage: number; // percentage 0-100
  totalArea: number; // in mm²
  usedArea: number; // in mm²
  wasteArea: number; // in mm²
  numberOfSheets: number;
  estimatedCost: number;
  processingTimeMs: number;
}

export class OptimizationMetrics {
  public readonly materialUtilization: number;
  public readonly wastePercentage: number;
  public readonly totalArea: number;
  public readonly usedArea: number;
  public readonly wasteArea: number;
  public readonly numberOfSheets: number;
  public readonly estimatedCost: number;
  public readonly processingTimeMs: number;

  constructor(props: OptimizationMetricsProps) {
    this.validateProps(props);
    
    this.materialUtilization = props.materialUtilization;
    this.wastePercentage = props.wastePercentage;
    this.totalArea = props.totalArea;
    this.usedArea = props.usedArea;
    this.wasteArea = props.wasteArea;
    this.numberOfSheets = props.numberOfSheets;
    this.estimatedCost = props.estimatedCost;
    this.processingTimeMs = props.processingTimeMs;
  }

  private validateProps(props: OptimizationMetricsProps): void {
    if (props.materialUtilization < 0 || props.materialUtilization > 100) {
      throw new Error('Material utilization must be between 0 and 100');
    }

    if (props.wastePercentage < 0 || props.wastePercentage > 100) {
      throw new Error('Waste percentage must be between 0 and 100');
    }

    if (props.totalArea < 0) {
      throw new Error('Total area cannot be negative');
    }

    if (props.usedArea < 0) {
      throw new Error('Used area cannot be negative');
    }

    if (props.wasteArea < 0) {
      throw new Error('Waste area cannot be negative');
    }

    if (props.numberOfSheets < 0) {
      throw new Error('Number of sheets cannot be negative');
    }

    if (props.estimatedCost < 0) {
      throw new Error('Estimated cost cannot be negative');
    }

    if (props.processingTimeMs < 0) {
      throw new Error('Processing time cannot be negative');
    }
  }

  public calculateEfficiencyScore(): number {
    // Weighted score: 70% utilization + 30% waste reduction
    return (this.materialUtilization * 0.7) + ((100 - this.wastePercentage) * 0.3);
  }

  public toProps(): OptimizationMetricsProps {
    return {
      materialUtilization: this.materialUtilization,
      wastePercentage: this.wastePercentage,
      totalArea: this.totalArea,
      usedArea: this.usedArea,
      wasteArea: this.wasteArea,
      numberOfSheets: this.numberOfSheets,
      estimatedCost: this.estimatedCost,
      processingTimeMs: this.processingTimeMs,
    };
  }
}

export interface OptimizationResultProps {
  id: string;
  materialId: string;
  placedPieces: PlacedPiece[];
  metrics: OptimizationMetrics;
  sheetIndex: number;
  notes?: string;
}

export class OptimizationResult {
  public readonly id: string;
  public readonly materialId: string;
  public readonly placedPieces: PlacedPiece[];
  public readonly metrics: OptimizationMetrics;
  public readonly sheetIndex: number;
  public readonly notes?: string;

  constructor(props: OptimizationResultProps) {
    this.validateProps(props);
    
    this.id = props.id;
    this.materialId = props.materialId;
    this.placedPieces = props.placedPieces;
    this.metrics = props.metrics;
    this.sheetIndex = props.sheetIndex;
    this.notes = props.notes;
  }

  private validateProps(props: OptimizationResultProps): void {
    if (!props.id || props.id.trim() === '') {
      throw new Error('Result ID is required');
    }

    if (!props.materialId || props.materialId.trim() === '') {
      throw new Error('Material ID is required');
    }

    if (props.sheetIndex < 0) {
      throw new Error('Sheet index cannot be negative');
    }
  }

  public toProps(): OptimizationResultProps {
    return {
      id: this.id,
      materialId: this.materialId,
      placedPieces: this.placedPieces,
      metrics: this.metrics,
      sheetIndex: this.sheetIndex,
      notes: this.notes,
    };
  }
}

export interface OptimizationProps {
  id: string;
  orderId: string;
  status: OptimizationStatus;
  results: OptimizationResult[];
  algorithmUsed?: string;
  parameters?: Record<string, unknown>;
  errorMessage?: string;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  updatedAt?: Date;
}

export class Optimization {
  public readonly id: string;
  public readonly orderId: string;
  public readonly status: OptimizationStatus;
  public readonly results: OptimizationResult[];
  public readonly algorithmUsed?: string;
  public readonly parameters?: Record<string, unknown>;
  public readonly errorMessage?: string;
  public readonly createdAt: Date;
  public readonly startedAt?: Date;
  public readonly completedAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: OptimizationProps) {
    this.validateProps(props);
    
    this.id = props.id;
    this.orderId = props.orderId;
    this.status = props.status;
    this.results = props.results;
    this.algorithmUsed = props.algorithmUsed;
    this.parameters = props.parameters;
    this.errorMessage = props.errorMessage;
    this.createdAt = props.createdAt;
    this.startedAt = props.startedAt;
    this.completedAt = props.completedAt;
    this.updatedAt = props.updatedAt;
  }

  private validateProps(props: OptimizationProps): void {
    if (!props.id || props.id.trim() === '') {
      throw new Error('Optimization ID is required');
    }

    if (!props.orderId || props.orderId.trim() === '') {
      throw new Error('Order ID is required');
    }
  }

  public start(): Optimization {
    if (this.status !== OptimizationStatus.PENDING) {
      throw new Error('Can only start pending optimizations');
    }

    return new Optimization({
      ...this.toProps(),
      status: OptimizationStatus.RUNNING,
      startedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public complete(results: OptimizationResult[]): Optimization {
    if (this.status !== OptimizationStatus.RUNNING) {
      throw new Error('Can only complete running optimizations');
    }

    return new Optimization({
      ...this.toProps(),
      status: OptimizationStatus.COMPLETED,
      results,
      completedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public fail(errorMessage: string): Optimization {
    if (this.status !== OptimizationStatus.RUNNING) {
      throw new Error('Can only fail running optimizations');
    }

    return new Optimization({
      ...this.toProps(),
      status: OptimizationStatus.FAILED,
      errorMessage,
      completedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public cancel(): Optimization {
    if (this.status === OptimizationStatus.COMPLETED || this.status === OptimizationStatus.FAILED) {
      throw new Error('Cannot cancel completed or failed optimizations');
    }

    return new Optimization({
      ...this.toProps(),
      status: OptimizationStatus.CANCELLED,
      completedAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public getTotalProcessingTimeMs(): number | null {
    if (!this.startedAt || !this.completedAt) {
      return null;
    }

    return this.completedAt.getTime() - this.startedAt.getTime();
  }

  public getBestResult(): OptimizationResult | null {
    if (this.results.length === 0) {
      return null;
    }

    return this.results.reduce((best, current) => {
      const bestScore = best.metrics.calculateEfficiencyScore();
      const currentScore = current.metrics.calculateEfficiencyScore();
      return currentScore > bestScore ? current : best;
    });
  }

  public getResultsByMaterial(materialId: string): OptimizationResult[] {
    return this.results.filter(result => result.materialId === materialId);
  }

  public isCompleted(): boolean {
    return this.status === OptimizationStatus.COMPLETED;
  }

  public isFailed(): boolean {
    return this.status === OptimizationStatus.FAILED;
  }

  public isRunning(): boolean {
    return this.status === OptimizationStatus.RUNNING;
  }

  public toProps(): OptimizationProps {
    return {
      id: this.id,
      orderId: this.orderId,
      status: this.status,
      results: this.results,
      algorithmUsed: this.algorithmUsed,
      parameters: this.parameters,
      errorMessage: this.errorMessage,
      createdAt: this.createdAt,
      startedAt: this.startedAt,
      completedAt: this.completedAt,
      updatedAt: this.updatedAt,
    };
  }
}