import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Order, OrderStatus } from '../../domain/entities/Order';

export interface OrderFilters {
  search: string;
  status: OrderStatus | null;
  customerEmail: string;
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface OrdersState {
  // State
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  filters: OrderFilters;

  // Actions
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  updateOrder: (order: Order) => void;
  removeOrder: (id: string) => void;
  setSelectedOrder: (order: Order | null) => void;
  clearSelectedOrder: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  updateFilters: (filters: Partial<OrderFilters>) => void;
  resetFilters: () => void;
  getFilteredOrders: () => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getOrderStatistics: () => {
    total: number;
    byStatus: Record<OrderStatus, number>;
  };
  reset: () => void;
}

const initialState = {
  orders: [],
  selectedOrder: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    status: null,
    customerEmail: '',
    dateRange: { start: null, end: null },
  },
};

export const useOrdersStore = create<OrdersState>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      setOrders: (orders: Order[]) =>
        set((state) => {
          state.orders = orders;
        }),

      addOrder: (order: Order) =>
        set((state) => {
          state.orders.push(order);
        }),

      updateOrder: (updatedOrder: Order) =>
        set((state) => {
          const index = state.orders.findIndex(o => o.id === updatedOrder.id);
          if (index !== -1) {
            state.orders[index] = updatedOrder;
          }
        }),

      removeOrder: (id: string) =>
        set((state) => {
          state.orders = state.orders.filter(o => o.id !== id);
          if (state.selectedOrder?.id === id) {
            state.selectedOrder = null;
          }
        }),

      setSelectedOrder: (order: Order | null) =>
        set((state) => {
          state.selectedOrder = order;
        }),

      clearSelectedOrder: () =>
        set((state) => {
          state.selectedOrder = null;
        }),

      setLoading: (loading: boolean) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setError: (error: string | null) =>
        set((state) => {
          state.error = error;
        }),

      clearError: () =>
        set((state) => {
          state.error = null;
        }),

      updateFilters: (newFilters: Partial<OrderFilters>) =>
        set((state) => {
          state.filters = { ...state.filters, ...newFilters };
        }),

      resetFilters: () =>
        set((state) => {
          state.filters = {
            search: '',
            status: null,
            customerEmail: '',
            dateRange: { start: null, end: null },
          };
        }),

      getFilteredOrders: () => {
        const { orders, filters } = get();
        
        return orders.filter((order) => {
          // Search filter (customer name or order ID)
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            const matchesName = order.customerName.toLowerCase().includes(searchLower);
            const matchesId = order.id.toLowerCase().includes(searchLower);
            if (!matchesName && !matchesId) {
              return false;
            }
          }

          // Status filter
          if (filters.status && order.status !== filters.status) {
            return false;
          }

          // Customer email filter
          if (filters.customerEmail && !order.customerEmail.toLowerCase().includes(filters.customerEmail.toLowerCase())) {
            return false;
          }

          // Date range filter
          if (filters.dateRange.start && order.createdAt < filters.dateRange.start) {
            return false;
          }
          if (filters.dateRange.end && order.createdAt > filters.dateRange.end) {
            return false;
          }

          return true;
        });
      },

      getOrdersByStatus: (status: OrderStatus) => {
        const { orders } = get();
        return orders.filter(order => order.status === status);
      },

      getOrderStatistics: () => {
        const { orders } = get();
        
        const stats = {
          total: orders.length,
          byStatus: {} as Record<OrderStatus, number>,
        };

        // Initialize all statuses with 0
        Object.values(OrderStatus).forEach(status => {
          stats.byStatus[status] = 0;
        });

        // Count orders by status
        orders.forEach(order => {
          stats.byStatus[order.status]++;
        });

        return stats;
      },

      reset: () =>
        set((state) => {
          Object.assign(state, initialState);
        }),
    })),
    {
      name: 'maxicortes-orders-store',
      partialize: (state) => ({
        orders: state.orders,
        filters: state.filters,
      }),
    }
  )
);