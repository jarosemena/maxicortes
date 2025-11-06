import { Geometry } from './Geometry';

export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  OPTIMIZING = 'OPTIMIZING',
  OPTIMIZED = 'OPTIMIZED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

export interface OrderItemProps {
  id: string;
  materialId: string;
  geometry: Geometry;
  quantity: number;
  toleranceMm: number;
  priority: number;
  description?: string;
  createdAt?: Date;
}

export class OrderItem {
  public readonly id: string;
  public readonly materialId: string;
  public readonly geometry: Geometry;
  public readonly quantity: number;
  public readonly toleranceMm: number;
  public readonly priority: number;
  public readonly description?: string;
  public readonly createdAt?: Date;

  constructor(props: OrderItemProps) {
    this.validateProps(props);
    
    this.id = props.id;
    this.materialId = props.materialId;
    this.geometry = props.geometry;
    this.quantity = props.quantity;
    this.toleranceMm = props.toleranceMm;
    this.priority = props.priority;
    this.description = props.description;
    this.createdAt = props.createdAt || new Date();
  }

  private validateProps(props: OrderItemProps): void {
    if (!props.id || props.id.trim() === '') {
      throw new Error('Order item ID is required');
    }

    if (!props.materialId || props.materialId.trim() === '') {
      throw new Error('Material ID is required');
    }

    if (props.quantity <= 0) {
      throw new Error('Quantity must be positive');
    }

    if (props.toleranceMm < 0) {
      throw new Error('Tolerance cannot be negative');
    }

    if (props.priority < 1) {
      throw new Error('Priority must be at least 1');
    }
  }

  public calculateTotalArea(): number {
    return this.geometry.calculateArea() * this.quantity;
  }

  public toProps(): OrderItemProps {
    return {
      id: this.id,
      materialId: this.materialId,
      geometry: this.geometry,
      quantity: this.quantity,
      toleranceMm: this.toleranceMm,
      priority: this.priority,
      description: this.description,
      createdAt: this.createdAt,
    };
  }
}

export interface OrderProps {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  status: OrderStatus;
  notes?: string;
  estimatedCompletionDate?: Date;
  actualCompletionDate?: Date;
  totalCost?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export class Order {
  public readonly id: string;
  public readonly customerName: string;
  public readonly customerEmail: string;
  public readonly customerPhone?: string;
  public readonly items: OrderItem[];
  public readonly status: OrderStatus;
  public readonly notes?: string;
  public readonly estimatedCompletionDate?: Date;
  public readonly actualCompletionDate?: Date;
  public readonly totalCost?: number;
  public readonly createdAt: Date;
  public readonly updatedAt?: Date;

  constructor(props: OrderProps) {
    this.validateProps(props);
    
    this.id = props.id;
    this.customerName = props.customerName;
    this.customerEmail = props.customerEmail;
    this.customerPhone = props.customerPhone;
    this.items = props.items;
    this.status = props.status;
    this.notes = props.notes;
    this.estimatedCompletionDate = props.estimatedCompletionDate;
    this.actualCompletionDate = props.actualCompletionDate;
    this.totalCost = props.totalCost;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  private validateProps(props: OrderProps): void {
    if (!props.id || props.id.trim() === '') {
      throw new Error('Order ID is required');
    }

    if (!props.customerName || props.customerName.trim() === '') {
      throw new Error('Customer name is required');
    }

    if (!props.customerEmail || props.customerEmail.trim() === '') {
      throw new Error('Customer email is required');
    }

    if (!this.isValidEmail(props.customerEmail)) {
      throw new Error('Invalid email format');
    }

    if (!props.items || props.items.length === 0) {
      throw new Error('Order must have at least one item');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public getTotalItemsCount(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0);
  }

  public getTotalArea(): number {
    return this.items.reduce((total, item) => total + item.calculateTotalArea(), 0);
  }

  public getItemsByMaterial(materialId: string): OrderItem[] {
    return this.items.filter(item => item.materialId === materialId);
  }

  public canBeCancelled(): boolean {
    return this.status === OrderStatus.PENDING || this.status === OrderStatus.IN_PROGRESS;
  }

  public canBeOptimized(): boolean {
    return this.status === OrderStatus.PENDING || this.status === OrderStatus.IN_PROGRESS;
  }

  public isCompleted(): boolean {
    return this.status === OrderStatus.COMPLETED;
  }

  public isCancelled(): boolean {
    return this.status === OrderStatus.CANCELLED;
  }

  public updateStatus(newStatus: OrderStatus): Order {
    const updatedProps: OrderProps = {
      ...this.toProps(),
      status: newStatus,
      updatedAt: new Date(),
    };

    // Set completion date if completing
    if (newStatus === OrderStatus.COMPLETED && !this.actualCompletionDate) {
      updatedProps.actualCompletionDate = new Date();
    }

    return new Order(updatedProps);
  }

  public addItem(item: OrderItem): Order {
    return new Order({
      ...this.toProps(),
      items: [...this.items, item],
      updatedAt: new Date(),
    });
  }

  public removeItem(itemId: string): Order {
    const filteredItems = this.items.filter(item => item.id !== itemId);
    
    if (filteredItems.length === 0) {
      throw new Error('Cannot remove last item from order');
    }

    return new Order({
      ...this.toProps(),
      items: filteredItems,
      updatedAt: new Date(),
    });
  }

  public updateTotalCost(cost: number): Order {
    if (cost < 0) {
      throw new Error('Total cost cannot be negative');
    }

    return new Order({
      ...this.toProps(),
      totalCost: cost,
      updatedAt: new Date(),
    });
  }

  public toProps(): OrderProps {
    return {
      id: this.id,
      customerName: this.customerName,
      customerEmail: this.customerEmail,
      customerPhone: this.customerPhone,
      items: this.items,
      status: this.status,
      notes: this.notes,
      estimatedCompletionDate: this.estimatedCompletionDate,
      actualCompletionDate: this.actualCompletionDate,
      totalCost: this.totalCost,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}