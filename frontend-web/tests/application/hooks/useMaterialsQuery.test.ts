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

// Mock will be handled in the hook implementation

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

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useMaterialsQuery(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();
  });
});

describe('useCreateMaterialMutation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useCreateMaterialMutation(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isPending).toBe(false);
    expect(result.current.isError).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});