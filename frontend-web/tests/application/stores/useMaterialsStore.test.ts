import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { Material, MaterialType } from '../../../src/domain/entities/Material';
import { useMaterialsStore } from '../../../src/application/stores/useMaterialsStore';

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

describe('useMaterialsStore', () => {
  const createTestMaterial = (id: string = 'mat-001'): Material => {
    return new Material({
      id,
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

  beforeEach(() => {
    // Reset store state before each test
    const { result } = renderHook(() => useMaterialsStore());
    act(() => {
      result.current.reset();
    });
    vi.clearAllMocks();
  });

  it('should have initial state', () => {
    const { result } = renderHook(() => useMaterialsStore());
    
    expect(result.current.materials).toEqual([]);
    expect(result.current.selectedMaterial).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.filters).toEqual({
      search: '',
      type: null,
      availableOnly: false,
    });
  });

  it('should set materials', () => {
    const { result } = renderHook(() => useMaterialsStore());
    const materials = [createTestMaterial('mat-1'), createTestMaterial('mat-2')];

    act(() => {
      result.current.setMaterials(materials);
    });

    expect(result.current.materials).toEqual(materials);
  });

  it('should add material', () => {
    const { result } = renderHook(() => useMaterialsStore());
    const material = createTestMaterial();

    act(() => {
      result.current.addMaterial(material);
    });

    expect(result.current.materials).toContain(material);
    expect(result.current.materials).toHaveLength(1);
  });

  it('should update material', () => {
    const { result } = renderHook(() => useMaterialsStore());
    const material = createTestMaterial();
    const updatedMaterial = material.update({ name: 'Updated Material' });

    act(() => {
      result.current.setMaterials([material]);
    });

    act(() => {
      result.current.updateMaterial(updatedMaterial);
    });

    expect(result.current.materials[0].name).toBe('Updated Material');
  });

  it('should remove material', () => {
    const { result } = renderHook(() => useMaterialsStore());
    const material = createTestMaterial();

    act(() => {
      result.current.setMaterials([material]);
    });

    act(() => {
      result.current.removeMaterial(material.id);
    });

    expect(result.current.materials).toHaveLength(0);
  });

  it('should set selected material', () => {
    const { result } = renderHook(() => useMaterialsStore());
    const material = createTestMaterial();

    act(() => {
      result.current.setSelectedMaterial(material);
    });

    expect(result.current.selectedMaterial).toEqual(material);
  });

  it('should clear selected material', () => {
    const { result } = renderHook(() => useMaterialsStore());
    const material = createTestMaterial();

    act(() => {
      result.current.setSelectedMaterial(material);
    });

    act(() => {
      result.current.clearSelectedMaterial();
    });

    expect(result.current.selectedMaterial).toBeNull();
  });

  it('should set loading state', () => {
    const { result } = renderHook(() => useMaterialsStore());

    act(() => {
      result.current.setLoading(true);
    });

    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });

    expect(result.current.isLoading).toBe(false);
  });

  it('should set error', () => {
    const { result } = renderHook(() => useMaterialsStore());
    const error = 'Something went wrong';

    act(() => {
      result.current.setError(error);
    });

    expect(result.current.error).toBe(error);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useMaterialsStore());

    act(() => {
      result.current.setError('Error');
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });

  it('should update filters', () => {
    const { result } = renderHook(() => useMaterialsStore());

    act(() => {
      result.current.updateFilters({
        search: 'plywood',
        type: MaterialType.WOOD,
        availableOnly: true,
      });
    });

    expect(result.current.filters).toEqual({
      search: 'plywood',
      type: MaterialType.WOOD,
      availableOnly: true,
    });
  });

  it('should reset filters', () => {
    const { result } = renderHook(() => useMaterialsStore());

    act(() => {
      result.current.updateFilters({
        search: 'test',
        type: MaterialType.METAL,
        availableOnly: true,
      });
    });

    act(() => {
      result.current.resetFilters();
    });

    expect(result.current.filters).toEqual({
      search: '',
      type: null,
      availableOnly: false,
    });
  });

  it('should get filtered materials', () => {
    const { result } = renderHook(() => useMaterialsStore());
    const woodMaterial = new Material({
      id: 'wood-1',
      name: 'Plywood',
      type: MaterialType.WOOD,
      width: 2000,
      height: 1000,
      thickness: 18,
      pricePerSquareMeter: 50,
      availableQuantity: 10,
      isActive: true,
    });
    const metalMaterial = new Material({
      id: 'metal-1',
      name: 'Steel Sheet',
      type: MaterialType.METAL,
      width: 2000,
      height: 1000,
      thickness: 2,
      pricePerSquareMeter: 80,
      availableQuantity: 0,
      isActive: true,
    });

    act(() => {
      result.current.setMaterials([woodMaterial, metalMaterial]);
    });

    // Filter by type
    act(() => {
      result.current.updateFilters({ type: MaterialType.WOOD });
    });

    expect(result.current.getFilteredMaterials()).toEqual([woodMaterial]);

    // Filter by search
    act(() => {
      result.current.updateFilters({ search: 'steel', type: null });
    });

    expect(result.current.getFilteredMaterials()).toEqual([metalMaterial]);

    // Filter by availability
    act(() => {
      result.current.updateFilters({ search: '', availableOnly: true });
    });

    expect(result.current.getFilteredMaterials()).toEqual([woodMaterial]);
  });

  it('should persist state to localStorage', () => {
    const { result } = renderHook(() => useMaterialsStore());
    const material = createTestMaterial();

    act(() => {
      result.current.addMaterial(material);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'maxicortes-materials-store',
      expect.stringContaining(material.id)
    );
  });

  it('should reset store state', () => {
    const { result } = renderHook(() => useMaterialsStore());
    const material = createTestMaterial();

    act(() => {
      result.current.setMaterials([material]);
      result.current.setSelectedMaterial(material);
      result.current.setError('Error');
      result.current.updateFilters({ search: 'test' });
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.materials).toEqual([]);
    expect(result.current.selectedMaterial).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.filters).toEqual({
      search: '',
      type: null,
      availableOnly: false,
    });
  });
});