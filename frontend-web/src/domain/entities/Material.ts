export enum MaterialType {
  WOOD = 'WOOD',
  METAL = 'METAL',
  PLASTIC = 'PLASTIC',
  GLASS = 'GLASS',
  COMPOSITE = 'COMPOSITE',
}

export interface MaterialProps {
  id: string;
  name: string;
  type: MaterialType;
  width: number; // in mm
  height: number; // in mm
  thickness: number; // in mm
  pricePerSquareMeter: number;
  availableQuantity: number;
  isActive: boolean;
  description?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Material {
  public readonly id: string;
  public readonly name: string;
  public readonly type: MaterialType;
  public readonly width: number;
  public readonly height: number;
  public readonly thickness: number;
  public readonly pricePerSquareMeter: number;
  public readonly availableQuantity: number;
  public readonly isActive: boolean;
  public readonly description?: string;
  public readonly imageUrl?: string;
  public readonly createdAt?: Date;
  public readonly updatedAt?: Date;

  constructor(props: MaterialProps) {
    this.validateProps(props);
    
    this.id = props.id;
    this.name = props.name;
    this.type = props.type;
    this.width = props.width;
    this.height = props.height;
    this.thickness = props.thickness;
    this.pricePerSquareMeter = props.pricePerSquareMeter;
    this.availableQuantity = props.availableQuantity;
    this.isActive = props.isActive;
    this.description = props.description;
    this.imageUrl = props.imageUrl;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  private validateProps(props: MaterialProps): void {
    if (!props.id || props.id.trim() === '') {
      throw new Error('Material ID is required');
    }

    if (!props.name || props.name.trim() === '') {
      throw new Error('Material name is required');
    }

    if (props.width <= 0) {
      throw new Error('Width must be positive');
    }

    if (props.height <= 0) {
      throw new Error('Height must be positive');
    }

    if (props.thickness <= 0) {
      throw new Error('Thickness must be positive');
    }

    if (props.pricePerSquareMeter < 0) {
      throw new Error('Price per square meter must be positive');
    }

    if (props.availableQuantity < 0) {
      throw new Error('Available quantity cannot be negative');
    }
  }

  /**
   * Calculate the area of the material in square meters
   */
  public calculateArea(): number {
    return (this.width * this.height) / 1_000_000; // Convert mm² to m²
  }

  /**
   * Calculate the total value of available material
   */
  public calculateTotalValue(): number {
    return this.calculateArea() * this.pricePerSquareMeter * this.availableQuantity;
  }

  /**
   * Check if material is available for use
   */
  public isAvailable(): boolean {
    return this.isActive && this.availableQuantity > 0;
  }

  /**
   * Create a copy of the material with updated properties
   */
  public update(updates: Partial<Omit<MaterialProps, 'id'>>): Material {
    return new Material({
      ...this.toProps(),
      ...updates,
      updatedAt: new Date(),
    });
  }

  /**
   * Convert material to plain object
   */
  public toProps(): MaterialProps {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      width: this.width,
      height: this.height,
      thickness: this.thickness,
      pricePerSquareMeter: this.pricePerSquareMeter,
      availableQuantity: this.availableQuantity,
      isActive: this.isActive,
      description: this.description,
      imageUrl: this.imageUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}