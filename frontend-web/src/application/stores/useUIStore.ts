import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  data: any;
}

interface UIState {
  // State
  sidebarOpen: boolean;
  notifications: Notification[];
  modals: Record<string, ModalState>;
  loading: Record<string, boolean>;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  openModal: (modalId: string, data?: any) => void;
  closeModal: (modalId: string) => void;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;
  
  // Convenience methods for notifications
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  
  reset: () => void;
}

const initialState = {
  sidebarOpen: true,
  notifications: [],
  modals: {},
  loading: {},
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useUIStore = create<UIState>()(
  immer((set, get) => ({
    ...initialState,

    toggleSidebar: () =>
      set((state) => {
        state.sidebarOpen = !state.sidebarOpen;
      }),

    setSidebarOpen: (open: boolean) =>
      set((state) => {
        state.sidebarOpen = open;
      }),

    addNotification: (notification: Notification) =>
      set((state) => {
        state.notifications.push(notification);
      }),

    removeNotification: (id: string) =>
      set((state) => {
        state.notifications = state.notifications.filter(n => n.id !== id);
      }),

    clearNotifications: () =>
      set((state) => {
        state.notifications = [];
      }),

    openModal: (modalId: string, data: any = null) =>
      set((state) => {
        state.modals[modalId] = {
          isOpen: true,
          data,
        };
      }),

    closeModal: (modalId: string) =>
      set((state) => {
        if (state.modals[modalId]) {
          state.modals[modalId] = {
            isOpen: false,
            data: null,
          };
        }
      }),

    setLoading: (key: string, loading: boolean) =>
      set((state) => {
        state.loading[key] = loading;
      }),

    isLoading: (key: string) => {
      const { loading } = get();
      return loading[key] || false;
    },

    showSuccess: (message: string, title?: string) => {
      const { addNotification } = get();
      addNotification({
        id: generateId(),
        type: 'success',
        title: title || 'Success',
        message,
        duration: 5000,
      });
    },

    showError: (message: string, title?: string) => {
      const { addNotification } = get();
      addNotification({
        id: generateId(),
        type: 'error',
        title: title || 'Error',
        message,
        duration: 7000,
      });
    },

    showWarning: (message: string, title?: string) => {
      const { addNotification } = get();
      addNotification({
        id: generateId(),
        type: 'warning',
        title: title || 'Warning',
        message,
        duration: 6000,
      });
    },

    showInfo: (message: string, title?: string) => {
      const { addNotification } = get();
      addNotification({
        id: generateId(),
        type: 'info',
        title: title || 'Information',
        message,
        duration: 5000,
      });
    },

    reset: () =>
      set((state) => {
        Object.assign(state, initialState);
      }),
  }))
);