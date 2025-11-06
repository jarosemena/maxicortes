import { describe, it, expect, vi } from 'vitest';
import { GetMaterialsUseCase } from '@/domain/use-cases/materials/GetMaterialsUseCase';
import { IMaterialRepository } from '@/domain/repositories/IMaterialRepository';
import { Material, MaterialType } from '@/domain/entities/Material';

describe('GetMaterialsUseCase', () => {
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

  const createMockRepository = (): IMaterialRepository => ({
    findAll: vi.fn(),
    findById: vi.fn(),
    findByType: vi.fn(),
    findAvailable: vi.fn(),
    save: vi.fn(),
    delete: vi.fn(),
    updateStock: vi.fn(),
    search: vi.fn(),
    findLowStock: vi.fn(),
  });

  it('should get all materials', async () => {
    const materials = [createTestMaterial('mat-1'), createTestMaterial('mat-2')];
    const repository = createMockRepository();
    vi.mocked(repository.findAll).mockResolvedValue(materials);

    const useCase = new GetMaterialsUseCase(repository);
    const result = await useCase.execute();

    expect(result).toEqual(materials);
    expect(repository.findAll).toHaveBeenCalledOnce();
  });

  it('should get materials by type', async () => {
    const woodMaterials = [createTestMaterial('wood-1')];
    const repository = createMockRepository();
    vi.mocked(repository.findByType).mockResolvedValue(woodMaterials);

    const useCase = new GetMaterialsUseCase(repository);
    const result = await useCase.executeByType(MaterialType.WOOD);

    expect(result).toEqual(woodMaterials);
    expect(repository.findByType).toHaveBeenCalledWith(MaterialType.WOOD);
  });

  it('should get only available materials', async () => {
    const availableMaterials = [createTestMaterial('available-1')];
    const repository = createMockRepository();
    vi.mocked(repository.findAvailable).mockResolvedValue(availableMaterials);

    const useCase = new GetMaterialsUseCase(repository);
    const result = await useCase.executeAvailable();

    expect(result).toEqual(availableMaterials);
    expect(repository.findAvailable).toHaveBeenCalledOnce();
  });

  it('should search materials by query', async () => {
    const searchResults = [createTestMaterial('search-1')];
    const repository = createMockRepository();
    vi.mocked(repository.search).mockResolvedValue(searchResults);

    const useCase = new GetMaterialsUseCase(repository);
    const result = await useCase.executeSearch('plywood');

    expect(result).toEqual(searchResults);
    expect(repository.search).toHaveBeenCalledWith('plywood');
  });

  it('should throw error for empty search query', async () => {
    const repository = createMockRepository();
    const useCase = new GetMaterialsUseCase(repository);

    await expect(useCase.executeSearch('')).rejects.toThrow('Search query cannot be empty');
    expect(repository.search).not.toHaveBeenCalled();
  });

  it('should get materials with low stock', async () => {
    const lowStockMaterials = [createTestMaterial('low-stock-1')];
    const repository = createMockRepository();
    vi.mocked(repository.findLowStock).mockResolvedValue(lowStockMaterials);

    const useCase = new GetMaterialsUseCase(repository);
    const result = await useCase.executeLowStock(5);

    expect(result).toEqual(lowStockMaterials);
    expect(repository.findLowStock).toHaveBeenCalledWith(5);
  });

  it('should use default threshold for low stock when not provided', async () => {
    const lowStockMaterials = [createTestMaterial('low-stock-1')];
    const repository = createMockRepository();
    vi.mocked(repository.findLowStock).mockResolvedValue(lowStockMaterials);

    const useCase = new GetMaterialsUseCase(repository);
    const result = await useCase.executeLowStock();

    expect(result).toEqual(lowStockMaterials);
    expect(repository.findLowStock).toHaveBeenCalledWith(10); // Default threshold
  });
});