import { describe, it, expect } from 'vitest';
import { Order, OrderStatus, OrderItem } from '@/domain/entities/Order';
import { Material, MaterialType } from '@/domain/entities/Material';
import { PolygonGeometry, Point } from '@/domain/entities/Geometry';

describe('Order Entity', () => {
  const createTestMaterial = (): Material => {
    return new Material({
      id: 'mat-001',
      name: 'Test Material',
      type: MaterialType.WOOD,
      width: 2000,
      height: 1000,
      thickness: 18,
      pricePerSquareMeter: 50,
      availableQuantity: 10,
      isActive: true,
    });
  };

  const createTestGeometry = (): PolygonGeometry => {
    return new PolygonGeometry([
      new Point(0, 0),
      new Point(100, 0),
      new Point(100, 100),
      new Point(0, 100),
    ]);
  };

  describe('OrderItem', () => {
    it('should create an order item with valid properties', () => {
      const material = createTestMaterial();
      const geometry = createTestGeometry();
      
      const orderItem = new OrderItem({
        id: 'item-001',
        materialId: material.id,
        geometry,
        quantity: 5,
        toleranceMm: 2,
        priority: 1,
      });

      expect(orderItem.id).toBe('item-001');
      expect(orderItem.materialId).toBe(material.id);
      expect(orderItem.geometry).toBe(geometry);
      expect(orderItem.quantity).toBe(5);
      expect(orderItem.toleranceMm).toBe(2);
      expect(orderItem.priority).toBe(1);
    });

    it('should throw error for invalid quantity', () => {
      const geometry = createTestGeometry();
      
      expect(() => {
        new OrderItem({
          id: 'item-001',
          materialId: 'mat-001',
          geometry,
          quantity: 0,
          toleranceMm: 2,
          priority: 1,
        });
      }).toThrow('Quantity must be positive');
    });

    it('should throw error for negative tolerance', () => {
      const geometry = createTestGeometry();
      
      expect(() => {
        new OrderItem({
          id: 'item-001',
          materialId: 'mat-001',
          geometry,
          quantity: 5,
          toleranceMm: -1,
          priority: 1,
        });
      }).toThrow('Tolerance cannot be negative');
    });

    it('should calculate total area correctly', () => {
      const geometry = createTestGeometry();
      
      const orderItem = new OrderItem({
        id: 'item-001',
        materialId: 'mat-001',
        geometry,
        quantity: 3,
        toleranceMm: 2,
        priority: 1,
      });

      const expectedArea = geometry.calculateArea() * 3;
      expect(orderItem.calculateTotalArea()).toBe(expectedArea);
    });
  });

  describe('Order', () => {
    it('should create an order with valid properties', () => {
      const orderItems = [
        new OrderItem({
          id: 'item-001',
          materialId: 'mat-001',
          geometry: createTestGeometry(),
          quantity: 2,
          toleranceMm: 2,
          priority: 1,
        }),
      ];

      const order = new Order({
        id: 'order-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: orderItems,
        status: OrderStatus.PENDING,
        createdAt: new Date('2023-01-01'),
      });

      expect(order.id).toBe('order-001');
      expect(order.customerName).toBe('John Doe');
      expect(order.customerEmail).toBe('john@example.com');
      expect(order.items).toEqual(orderItems);
      expect(order.status).toBe(OrderStatus.PENDING);
    });

    it('should throw error for empty customer name', () => {
      expect(() => {
        new Order({
          id: 'order-001',
          customerName: '',
          customerEmail: 'john@example.com',
          items: [],
          status: OrderStatus.PENDING,
          createdAt: new Date(),
        });
      }).toThrow('Customer name is required');
    });

    it('should throw error for invalid email', () => {
      expect(() => {
        new Order({
          id: 'order-001',
          customerName: 'John Doe',
          customerEmail: 'invalid-email',
          items: [],
          status: OrderStatus.PENDING,
          createdAt: new Date(),
        });
      }).toThrow('Invalid email format');
    });

    it('should throw error for empty items', () => {
      expect(() => {
        new Order({
          id: 'order-001',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          items: [],
          status: OrderStatus.PENDING,
          createdAt: new Date(),
        });
      }).toThrow('Order must have at least one item');
    });

    it('should calculate total items correctly', () => {
      const orderItems = [
        new OrderItem({
          id: 'item-001',
          materialId: 'mat-001',
          geometry: createTestGeometry(),
          quantity: 2,
          toleranceMm: 2,
          priority: 1,
        }),
        new OrderItem({
          id: 'item-002',
          materialId: 'mat-001',
          geometry: createTestGeometry(),
          quantity: 3,
          toleranceMm: 2,
          priority: 2,
        }),
      ];

      const order = new Order({
        id: 'order-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: orderItems,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
      });

      expect(order.getTotalItemsCount()).toBe(5); // 2 + 3
    });

    it('should calculate total area correctly', () => {
      const geometry = createTestGeometry();
      const orderItems = [
        new OrderItem({
          id: 'item-001',
          materialId: 'mat-001',
          geometry,
          quantity: 2,
          toleranceMm: 2,
          priority: 1,
        }),
        new OrderItem({
          id: 'item-002',
          materialId: 'mat-001',
          geometry,
          quantity: 3,
          toleranceMm: 2,
          priority: 2,
        }),
      ];

      const order = new Order({
        id: 'order-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: orderItems,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
      });

      const expectedArea = geometry.calculateArea() * 5; // (2 + 3) * area
      expect(order.getTotalArea()).toBe(expectedArea);
    });

    it('should check if order can be cancelled', () => {
      const orderItems = [
        new OrderItem({
          id: 'item-001',
          materialId: 'mat-001',
          geometry: createTestGeometry(),
          quantity: 2,
          toleranceMm: 2,
          priority: 1,
        }),
      ];

      const pendingOrder = new Order({
        id: 'order-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: orderItems,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
      });

      const completedOrder = new Order({
        id: 'order-002',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: orderItems,
        status: OrderStatus.COMPLETED,
        createdAt: new Date(),
      });

      expect(pendingOrder.canBeCancelled()).toBe(true);
      expect(completedOrder.canBeCancelled()).toBe(false);
    });

    it('should update status correctly', () => {
      const orderItems = [
        new OrderItem({
          id: 'item-001',
          materialId: 'mat-001',
          geometry: createTestGeometry(),
          quantity: 2,
          toleranceMm: 2,
          priority: 1,
        }),
      ];

      const order = new Order({
        id: 'order-001',
        customerName: 'John Doe',
        customerEmail: 'john@example.com',
        items: orderItems,
        status: OrderStatus.PENDING,
        createdAt: new Date(),
      });

      const updatedOrder = order.updateStatus(OrderStatus.IN_PROGRESS);
      
      expect(updatedOrder.status).toBe(OrderStatus.IN_PROGRESS);
      expect(updatedOrder.updatedAt).toBeDefined();
      expect(updatedOrder.id).toBe(order.id); // Same order, different instance
    });
  });
});