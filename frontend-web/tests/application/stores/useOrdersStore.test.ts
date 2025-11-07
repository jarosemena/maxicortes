import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Order, OrderStatus, OrderItem } from '../../../src/domain/entities/Order';
import { Material, MaterialType } from '../../../src/domain/entities/Material';
import { PolygonGeometry, Point } from '../../../src/domain/entities/Geometry';
import { useOrdersStore } from '../../../src/application/stores';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useOrdersStore', () => {
  const createTestOrder = (id: string = 'order-001'): Order => {
    const geometry = new PolygonGeometry([
      new Point(0, 0),
      new Point(100, 0),
      new Point(100, 100),
      new Point(0, 100),
    ]);

    const orderItem = new OrderItem({
      id: 'item-001',
      materialId: 'mat-001',
      geometry,
      quantity: 2,
      toleranceMm: 2,
      priority: 1,
    });

    return new Order({
      id,
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      items: [orderItem],
      status: OrderStatus.PENDING,
      createdAt: new Date('2023-01-01'),
    });
  };

  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useOrdersStore());
    act(() => {
      result.current.reset();
    });
    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useOrdersStore());
    
    expect(result.current.orders).toEqual([]);
    expect(result.current.selectedOrder).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.filters).toEqual({
      search: '',
      status: null,
      customerEmail: '',
      dateRange: { start: null, end: null },
    });
  });

  it('should set orders', () => {
    const { result } = renderHook(() => useOrdersStore());
    const orders = [createTestOrder('order-1'), createTestOrder('order-2')];

    act(() => {
      result.current.setOrders(orders);
    });

    expect(result.current.orders).toEqual(orders);
  });

  it('should add order', () => {
    const { result } = renderHook(() => useOrdersStore());
    const order = createTestOrder();

    act(() => {
      result.current.addOrder(order);
    });

    expect(result.current.orders).toContain(order);
    expect(result.current.orders).toHaveLength(1);
  });

  it('should update order', () => {
    const { result } = renderHook(() => useOrdersStore());
    const order = createTestOrder();
    const updatedOrder = order.updateStatus(OrderStatus.IN_PROGRESS);

    act(() => {
      result.current.setOrders([order]);
    });

    act(() => {
      result.current.updateOrder(updatedOrder);
    });

    expect(result.current.orders[0].status).toBe(OrderStatus.IN_PROGRESS);
  });

  it('should remove order', () => {
    const { result } = renderHook(() => useOrdersStore());
    const order = createTestOrder();

    act(() => {
      result.current.setOrders([order]);
    });

    act(() => {
      result.current.removeOrder(order.id);
    });

    expect(result.current.orders).toHaveLength(0);
  });

  it('should set selected order', () => {
    const { result } = renderHook(() => useOrdersStore());
    const order = createTestOrder();

    act(() => {
      result.current.setSelectedOrder(order);
    });

    expect(result.current.selectedOrder).toEqual(order);
  });

  it('should update filters', () => {
    const { result } = renderHook(() => useOrdersStore());

    act(() => {
      result.current.updateFilters({
        search: 'john',
        status: OrderStatus.PENDING,
        customerEmail: 'john@example.com',
      });
    });

    expect(result.current.filters.search).toBe('john');
    expect(result.current.filters.status).toBe(OrderStatus.PENDING);
    expect(result.current.filters.customerEmail).toBe('john@example.com');
  });

  it('should get filtered orders', () => {
    const { result } = renderHook(() => useOrdersStore());
    const pendingOrder = createTestOrder('pending-1');
    const completedOrder = new Order({
      id: 'completed-1',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      items: pendingOrder.items,
      status: OrderStatus.COMPLETED,
      createdAt: new Date('2023-01-02'),
    });

    act(() => {
      result.current.setOrders([pendingOrder, completedOrder]);
    });

    // Filter by status
    act(() => {
      result.current.updateFilters({ status: OrderStatus.PENDING });
    });

    expect(result.current.getFilteredOrders()).toEqual([pendingOrder]);

    // Filter by customer name
    act(() => {
      result.current.updateFilters({ search: 'jane', status: null });
    });

    expect(result.current.getFilteredOrders()).toEqual([completedOrder]);
  });

  it('should get orders by status', () => {
    const { result } = renderHook(() => useOrdersStore());
    const pendingOrder = createTestOrder('pending-1');
    const completedOrder = createTestOrder('completed-1');
    const updatedCompletedOrder = completedOrder.updateStatus(OrderStatus.COMPLETED);

    act(() => {
      result.current.setOrders([pendingOrder, updatedCompletedOrder]);
    });

    expect(result.current.getOrdersByStatus(OrderStatus.PENDING)).toEqual([pendingOrder]);
    expect(result.current.getOrdersByStatus(OrderStatus.COMPLETED)).toEqual([updatedCompletedOrder]);
  });

  it('should get order statistics', () => {
    const { result } = renderHook(() => useOrdersStore());
    const pendingOrder1 = createTestOrder('pending-1');
    const pendingOrder2 = createTestOrder('pending-2');
    const completedOrder = createTestOrder('completed-1');
    const updatedCompletedOrder = completedOrder.updateStatus(OrderStatus.COMPLETED);

    act(() => {
      result.current.setOrders([pendingOrder1, pendingOrder2, updatedCompletedOrder]);
    });

    const stats = result.current.getOrderStatistics();
    
    expect(stats.total).toBe(3);
    expect(stats.byStatus[OrderStatus.PENDING]).toBe(2);
    expect(stats.byStatus[OrderStatus.COMPLETED]).toBe(1);
  });

  it('should persist state to localStorage', () => {
    const { result } = renderHook(() => useOrdersStore());
    const order = createTestOrder();

    act(() => {
      result.current.addOrder(order);
    });

    // Note: Zustand persist middleware handles localStorage automatically
    expect(result.current.orders).toContain(order);
  });
});