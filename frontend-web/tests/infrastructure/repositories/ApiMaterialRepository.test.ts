import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiMaterialRepository } from '../../../src/infrastructure/repositories/ApiMaterialRepository';
import { Material, MaterialType } from '../../../src/domain/entities/Material';
import * as materialsApiModule from '../../../src/infrastructure/api/materialsApi';

// Mock materialsApi
vi.mock('../../../src/infrastructure/api/materialsApi', () => ({
  materialsApi: {
    getMaterials: vi.fn(),
    getMaterialById: vi.fn(),
    createMaterial: vi.fn(),
    updateMaterial: vi.fn(),
    deleteMaterial: vi.fn(),
    updateStock: vi.fn(),
  },
  mapDtoToMaterial: vi.fn((dto) => new Material(dto)),
  mapMaterialToDto: vi.fn((material) => ({
    id: material.id,
    name: material.name,
    type: material.type,
    width: material.width,
    height: material.height,
    thickness: material.thickness,
    pricePerSquareMeter: material.pricePerSquareMeter,
    availableQuantity: material.availableQuantity,
    isActive: material.isActive,
    description: material.description,
  })),
}));

describe('ApiMaterialRepository', () => {
  let repository: ApiMaterialRepository;
  const mockMaterialsApi = vi.mocked(materialsApiModule.materialsApi);

  beforeEach(() => {
    repository = new ApiMaterialRepository();
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should fetch all materials', async () => {
      const mockResponse = {
        data: [
          {
            id: 'mat-1',
            name: 'Material 1',
            type: MaterialType.WOOD,
            width: 2440,
            height: 1220,
            thickness: 18,
            pricePerSquareMeter: 50,
            availableQuantity: 10,
            isActive: true,
          },
        ],
        total: 1,
        page: 1,
        pageSize: 1000,
      };

      mockMaterialsApi.getMaterials.mockResolvedValue(mockResponse);

      const result = await repository.findAll();

      expect(mockMaterialsApi.getMaterials).toHaveBeenCalledWith({
        page: 1,
        pageSize: 1000,
      });
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Material);
    });

    it('should fetch materials with filters', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        pageSize: 1000,
      };

      mockMaterialsApi.getMaterials.mockResolvedValue(mockResponse);

      await repository.findAll({
        type: MaterialType.WOOD,
        isActive: true,
        search: 'test',
      });

      expect(mockMaterialsApi.getMaterials).toHaveBeenCalledWith({
        type: MaterialType.WOOD,
        isActive: true,
        search: 'test',
        page: 1,
        pageSize: 1000,
      });
    });
  });

  describe('findById', () => {
    it('should fetch a material by id', async () => {
      const mockDto = {
        id: 'mat-1',
        name: 'Material 1',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 10,
        isActive: true,
      };

      mockMaterialsApi.getMaterialById.mockResolvedValue(mockDto);

      const result = await repository.findById('mat-1');

      expect(mockMaterialsApi.getMaterialById).toHaveBeenCalledWith('mat-1');
      expect(result).toBeInstanceOf(Material);
      expect(result?.id).toBe('mat-1');
    });

    it('should return null if material not found', async () => {
      mockMaterialsApi.getMaterialById.mockRejectedValue(new Error('Not found'));

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('findByType', () => {
    it('should fetch materials by type', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        pageSize: 1000,
      };

      mockMaterialsApi.getMaterials.mockResolvedValue(mockResponse);

      await repository.findByType(MaterialType.WOOD);

      expect(mockMaterialsApi.getMaterials).toHaveBeenCalledWith({
        type: MaterialType.WOOD,
        page: 1,
        pageSize: 1000,
      });
    });
  });

  describe('findAvailable', () => {
    it('should fetch available materials', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        pageSize: 1000,
      };

      mockMaterialsApi.getMaterials.mockResolvedValue(mockResponse);

      await repository.findAvailable();

      expect(mockMaterialsApi.getMaterials).toHaveBeenCalledWith({
        isActive: true,
        page: 1,
        pageSize: 1000,
      });
    });
  });

  describe('search', () => {
    it('should search materials by query', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        pageSize: 1000,
      };

      mockMaterialsApi.getMaterials.mockResolvedValue(mockResponse);

      await repository.search('test query');

      expect(mockMaterialsApi.getMaterials).toHaveBeenCalledWith({
        search: 'test query',
        page: 1,
        pageSize: 1000,
      });
    });
  });

  describe('create', () => {
    it('should create a new material', async () => {
      const material = new Material({
        id: 'temp-id',
        name: 'New Material',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 10,
        isActive: true,
      });

      const mockCreated = {
        id: 'new-id',
        name: 'New Material',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 10,
        isActive: true,
      };

      mockMaterialsApi.createMaterial.mockResolvedValue(mockCreated);

      const result = await repository.create(material);

      expect(mockMaterialsApi.createMaterial).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Material);
    });
  });

  describe('update', () => {
    it('should update a material', async () => {
      const material = new Material({
        id: 'mat-1',
        name: 'Updated Material',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 60,
        availableQuantity: 10,
        isActive: true,
      });

      const mockUpdated = {
        id: 'mat-1',
        name: 'Updated Material',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 60,
        availableQuantity: 10,
        isActive: true,
      };

      mockMaterialsApi.updateMaterial.mockResolvedValue(mockUpdated);

      const result = await repository.update(material);

      expect(mockMaterialsApi.updateMaterial).toHaveBeenCalledWith('mat-1', expect.any(Object));
      expect(result).toBeInstanceOf(Material);
    });
  });

  describe('delete', () => {
    it('should delete a material', async () => {
      mockMaterialsApi.deleteMaterial.mockResolvedValue(undefined);

      await repository.delete('mat-1');

      expect(mockMaterialsApi.deleteMaterial).toHaveBeenCalledWith('mat-1');
    });
  });

  describe('updateStock', () => {
    it('should update material stock', async () => {
      const mockUpdated = {
        id: 'mat-1',
        name: 'Material 1',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 15,
        isActive: true,
      };

      mockMaterialsApi.updateStock.mockResolvedValue(mockUpdated);

      const result = await repository.updateStock('mat-1', 15);

      expect(mockMaterialsApi.updateStock).toHaveBeenCalledWith('mat-1', 15);
      expect(result).toBeInstanceOf(Material);
      expect(result.availableQuantity).toBe(15);
    });
  });

  describe('exists', () => {
    it('should return true if material exists', async () => {
      const mockDto = {
        id: 'mat-1',
        name: 'Material 1',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 10,
        isActive: true,
      };

      mockMaterialsApi.getMaterialById.mockResolvedValue(mockDto);

      const result = await repository.exists('mat-1');

      expect(result).toBe(true);
    });

    it('should return false if material does not exist', async () => {
      mockMaterialsApi.getMaterialById.mockRejectedValue(new Error('Not found'));

      const result = await repository.exists('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('count', () => {
    it('should return the count of materials', async () => {
      const mockResponse = {
        data: [
          {
            id: 'mat-1',
            name: 'Material 1',
            type: MaterialType.WOOD,
            width: 2440,
            height: 1220,
            thickness: 18,
            pricePerSquareMeter: 50,
            availableQuantity: 10,
            isActive: true,
          },
          {
            id: 'mat-2',
            name: 'Material 2',
            type: MaterialType.METAL,
            width: 3000,
            height: 1500,
            thickness: 2,
            pricePerSquareMeter: 80,
            availableQuantity: 5,
            isActive: true,
          },
        ],
        total: 2,
        page: 1,
        pageSize: 1000,
      };

      mockMaterialsApi.getMaterials.mockResolvedValue(mockResponse);

      const result = await repository.count();

      expect(result).toBe(2);
    });
  });
});
