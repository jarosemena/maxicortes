import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { Material, MaterialType } from '../../../src/domain/entities/Material';
import { IMaterialRepository } from '../../../src/domain/repositories/IMaterialRepository';
import { useMaterialsQuery, useCreateMaterialMutation } from '../../../src/application/hooks/useMaterialsQuery';

// Mock repository
const mockMaterialRepository: IMaterialRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findByType: vi.fn(),
  findAvailable: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
  updateStock: vi.fn(),
  search: vi.fn(),
  findLowStock: vi.fn(),
};

// Mock the repository injection
vi.mock('../../../src/infrastructure/repositories/MaterialRepository', () => ({
  MaterialRepository: vi.fn(() => mockMaterialRepository),
}));

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

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useMaterialsQuery', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch materials successfully', async () => {
    const materials = [createTestMaterial('mat-1'), createTestMaterial('mat-2')];
    vi.mocked(mockMaterialRepository.findAll).mockResolvedValue(materials);

    const { result } = renderHook(() => useMaterialsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(materials);
    expect(mockMaterialRepository.findAll).toHaveBeenCalledOnce();
  });

  it('should handle fetch error', async () => {
    const error = new Error('Failed to fetch materials');
    vi.mocked(mockMaterialRepository.findAll).mockRejectedValue(error);

    const { result } = renderHook(() => useMaterialsQuery(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('should show loading state', () => {
    vi.mocked(mockMaterialRepository.findAll).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useMaterialsQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });
});

describe('useCreateMaterialMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create material successfully', async () => {
    const material = createTestMaterial();
    vi.mocked(mockMaterialRepository.save).mockResolvedValue(material);

    const { result } = renderHook(() => useCreateMaterialMutation(), {
      wrapper: createWrapper(),
    });

    const materialData = {
      name: 'Test Material',
      type: MaterialType.WOOD,
      width: 2000,
      height: 1000,
      thickness: 18,
      pricePerSquareMeter: 50,
      availableQuantity: 10,
      isActive: true,
    };

    result.current.mutate(materialData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(material);
    expect(mockMaterialRepository.save).toHaveBeenCalledOnce();
  });

  it('should handle create error', async () => {
    const error = new Error('Failed to create material');
    vi.mocked(mockMaterialRepository.save).mockRejectedValue(error);

    const { result } = renderHook(() => useCreateMaterialMutation(), {
      wrapper: createWrapper(),
    });

    const materialData = {
      name: 'Test Material',
      type: MaterialType.WOOD,
      width: 2000,
      height: 1000,
      thickness: 18,
      pricePerSquareMeter: 50,
      availableQuantity: 10,
      isActive: true,
    };

    result.current.mutate(materialData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });

  it('should show loading state during mutation', () => {
    vi.mocked(mockMaterialRepository.save).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    const { result } = renderHook(() => useCreateMaterialMutation(), {
      wrapper: createWrapper(),
    });

    const materialData = {
      name: 'Test Material',
      type: MaterialType.WOOD,
      width: 2000,
      height: 1000,
      thickness: 18,
      pricePerSquareMeter: 50,
      availableQuantity: 10,
      isActive: true,
    };

    result.current.mutate(materialData);

    expect(result.current.isPending).toBe(true);
  });
});