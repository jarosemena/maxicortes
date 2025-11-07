import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUIStore } from '../../../src/application/stores';

describe('useUIStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.reset();
    });
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useUIStore());
    
    expect(result.current.sidebarOpen).toBe(true);
    expect(result.current.notifications).toEqual([]);
    expect(result.current.modals).toEqual({});
    expect(result.current.loading).toEqual({});
  });

  it('should toggle sidebar', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarOpen).toBe(true);
  });

  it('should set sidebar state', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setSidebarOpen(false);
    });

    expect(result.current.sidebarOpen).toBe(false);

    act(() => {
      result.current.setSidebarOpen(true);
    });

    expect(result.current.sidebarOpen).toBe(true);
  });

  it('should add notification', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.addNotification({
        id: 'notif-1',
        type: 'success',
        title: 'Success',
        message: 'Operation completed',
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toEqual({
      id: 'notif-1',
      type: 'success',
      title: 'Success',
      message: 'Operation completed',
    });
  });

  it('should remove notification', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.addNotification({
        id: 'notif-1',
        type: 'info',
        title: 'Info',
        message: 'Information',
      });
    });

    act(() => {
      result.current.removeNotification('notif-1');
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should clear all notifications', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.addNotification({
        id: 'notif-1',
        type: 'info',
        title: 'Info 1',
        message: 'Message 1',
      });
      result.current.addNotification({
        id: 'notif-2',
        type: 'warning',
        title: 'Warning',
        message: 'Message 2',
      });
    });

    act(() => {
      result.current.clearNotifications();
    });

    expect(result.current.notifications).toHaveLength(0);
  });

  it('should open modal', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.openModal('create-material', { materialId: 'mat-1' });
    });

    expect(result.current.modals['create-material']).toEqual({
      isOpen: true,
      data: { materialId: 'mat-1' },
    });
  });

  it('should close modal', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.openModal('create-material', { materialId: 'mat-1' });
    });

    act(() => {
      result.current.closeModal('create-material');
    });

    expect(result.current.modals['create-material']).toEqual({
      isOpen: false,
      data: null,
    });
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.setLoading('materials', true);
    });

    expect(result.current.loading['materials']).toBe(true);

    act(() => {
      result.current.setLoading('materials', false);
    });

    expect(result.current.loading['materials']).toBe(false);
  });

  it('should check if loading', () => {
    const { result } = renderHook(() => useUIStore());

    expect(result.current.isLoading('materials')).toBe(false);

    act(() => {
      result.current.setLoading('materials', true);
    });

    expect(result.current.isLoading('materials')).toBe(true);
  });

  it('should show success notification', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.showSuccess('Operation successful');
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('success');
    expect(result.current.notifications[0].message).toBe('Operation successful');
  });

  it('should show error notification', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.showError('Operation failed');
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('error');
    expect(result.current.notifications[0].message).toBe('Operation failed');
  });

  it('should show warning notification', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.showWarning('Warning message');
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('warning');
    expect(result.current.notifications[0].message).toBe('Warning message');
  });

  it('should show info notification', () => {
    const { result } = renderHook(() => useUIStore());

    act(() => {
      result.current.showInfo('Info message');
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].type).toBe('info');
    expect(result.current.notifications[0].message).toBe('Info message');
  });
});