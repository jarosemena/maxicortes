import { Order, OrderStatus } from '../entities/Order';

export interface IOrderRepository {
  /**
   * Find all orders
   */
  findAll(): Promise<Order[]>;

  /**
   * Find order by ID
   */
  findById(id: string): Promise<Order | null>;

  /**
   * Find orders by status
   */
  findByStatus(status: OrderStatus): Promise<Order[]>;

  /**
   * Find orders by customer email
   */
  findByCustomerEmail(email: string): Promise<Order[]>;

  /**
   * Find orders created within date range
   */
  findByDateRange(startDate: Date, endDate: Date): Promise<Order[]>;

  /**
   * Save order (create or update)
   */
  save(order: Order): Promise<Order>;

  /**
   * Delete order by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Update order status
   */
  updateStatus(id: string, status: OrderStatus): Promise<Order>;

  /**
   * Search orders by customer name or order ID
   */
  search(query: string): Promise<Order[]>;

  /**
   * Find pending orders (orders that can be processed)
   */
  findPending(): Promise<Order[]>;

  /**
   * Find orders that need optimization
   */
  findNeedingOptimization(): Promise<Order[]>;

  /**
   * Get order statistics
   */
  getStatistics(): Promise<{
    total: number;
    byStatus: Record<OrderStatus, number>;
    totalValue: number;
    averageValue: number;
  }>;
}