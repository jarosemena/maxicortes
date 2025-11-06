import { describe, it, expect, vi } from 'vitest';
import { CreateMaterialUseCase } from '@/domain/use-cases/materials/CreateMaterialUseCase';
import { IMaterialRepository } from '@/domain/repositories/IMaterialRepository';
import { Material, MaterialType } from '@/domain/entities/Material';

describe('CreateMaterialUseCase', () => {
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

  const validMaterialData = {
    name: 'Plywood 18mm',
    type: MaterialType.WOOD,
    width: 2440,
    height: 1220,
    thickness: 18,
    pricePerSquareMeter: 45.50,
    availableQuantity: 10,
    isActive: true,
    description: 'High quality plywood',
  };

  it('should create a new material successfully', async () => {
    const repository = createMockRepository();
    const savedMaterial = new Material({
      id: 'generated-id',
      ...validMaterialData,
    });
    
    vi.mocked(repository.save).mockResolvedValue(savedMaterial);

    const useCase = new CreateMaterialUseCase(repository);
    const result = await useCase.execute(validMaterialData);

    expect(result.name).toBe(validMaterialData.name);
    expect(result.type).toBe(validMaterialData.type);
    expect(result.width).toBe(validMaterialData.width);
    expect(repository.save).toHaveBeenCalledOnce();
  });

  it('should generate unique ID for new material', async () => {
    const repository = createMockRepository();
    vi.mocked(repository.save).mockImplementation(async (material) => material);

    const useCase = new CreateMaterialUseCase(repository);
    const result = await useCase.execute(validMaterialData);

    expect(result.id).toBeDefined();
    expect(result.id).toMatch(/^mat-/); // Should start with 'mat-'
  });

  it('should set creation timestamp', async () => {
    const repository = createMockRepository();
    vi.mocked(repository.save).mockImplementation(async (material) => material);

    const useCase = new CreateMaterialUseCase(repository);
    const result = await useCase.execute(validMaterialData);

    expect(result.createdAt).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('should throw error for invalid material data', async () => {
    const repository = createMockRepository();
    const useCase = new CreateMaterialUseCase(repository);

    const invalidData = {
      ...validMaterialData,
      name: '', // Invalid empty name
    };

    await expect(useCase.execute(invalidData)).rejects.toThrow('Material name is required');
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should throw error for negative dimensions', async () => {
    const repository = createMockRepository();
    const useCase = new CreateMaterialUseCase(repository);

    const invalidData = {
      ...validMaterialData,
      width: -100, // Invalid negative width
    };

    await expect(useCase.execute(invalidData)).rejects.toThrow('Width must be positive');
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should handle repository errors', async () => {
    const repository = createMockRepository();
    vi.mocked(repository.save).mockRejectedValue(new Error('Database error'));

    const useCase = new CreateMaterialUseCase(repository);

    await expect(useCase.execute(validMaterialData)).rejects.toThrow('Database error');
  });

  it('should create material with optional fields', async () => {
    const repository = createMockRepository();
    vi.mocked(repository.save).mockImplementation(async (material) => material);

    const minimalData = {
      name: 'Basic Material',
      type: MaterialType.WOOD,
      width: 1000,
      height: 500,
      thickness: 10,
      pricePerSquareMeter: 30,
      availableQuantity: 5,
      isActive: true,
    };

    const useCase = new CreateMaterialUseCase(repository);
    const result = await useCase.execute(minimalData);

    expect(result.name).toBe(minimalData.name);
    expect(result.description).toBeUndefined();
    expect(result.imageUrl).toBeUndefined();
  });
});