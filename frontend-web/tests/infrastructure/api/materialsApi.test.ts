import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MaterialsApiClient, mapDtoToMaterial, mapMaterialToDto } from '../../../src/infrastructure/api/materialsApi';
import { Material, MaterialType } from '../../../src/domain/entities/Material';
import * as apiClientModule from '../../../src/infrastructure/api/apiClient';

// Mock apiRequest
vi.mock('../../../src/infrastructure/api/apiClient', () => ({
  apiRequest: vi.fn(),
  apiClient: {},
  ApiError: class ApiError extends Error {},
  handleApiError: vi.fn(),
}));

describe('MaterialsApiClient', () => {
  let apiClient: MaterialsApiClient;
  const mockApiRequest = vi.mocked(apiClientModule.apiRequest);

  beforeEach(() => {
    apiClient = new MaterialsApiClient();
    vi.clearAllMocks();
  });

  describe('getMaterials', () => {
    it('should fetch materials without filters', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await apiClient.getMaterials();

      expect(mockApiRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/materials',
      });
      expect(result).toEqual(mockResponse);
    });

    it('should fetch materials with filters', async () => {
      const mockResponse = {
        data: [],
        total: 0,
        page: 1,
        pageSize: 10,
      };

      mockApiRequest.mockResolvedValue(mockResponse);

      await apiClient.getMaterials({
        type: MaterialType.WOOD,
        isActive: true,
        search: 'test',
        page: 2,
        pageSize: 20,
      });

      expect(mockApiRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: expect.stringContaining('/api/materials?'),
      });
    });
  });

  describe('getMaterialById', () => {
    it('should fetch a material by id', async () => {
      const mockMaterial = {
        id: 'test-id',
        name: 'Test Material',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 10,
        isActive: true,
      };

      mockApiRequest.mockResolvedValue(mockMaterial);

      const result = await apiClient.getMaterialById('test-id');

      expect(mockApiRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: '/api/materials/test-id',
      });
      expect(result).toEqual(mockMaterial);
    });
  });

  describe('createMaterial', () => {
    it('should create a new material', async () => {
      const createData = {
        name: 'New Material',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 10,
        isActive: true,
      };

      const mockResponse = {
        id: 'new-id',
        ...createData,
      };

      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await apiClient.createMaterial(createData);

      expect(mockApiRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/materials',
        data: createData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateMaterial', () => {
    it('should update a material', async () => {
      const updateData = {
        name: 'Updated Material',
        pricePerSquareMeter: 60,
      };

      const mockResponse = {
        id: 'test-id',
        name: 'Updated Material',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 60,
        availableQuantity: 10,
        isActive: true,
      };

      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await apiClient.updateMaterial('test-id', updateData);

      expect(mockApiRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: '/api/materials/test-id',
        data: updateData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteMaterial', () => {
    it('should delete a material', async () => {
      mockApiRequest.mockResolvedValue(undefined);

      await apiClient.deleteMaterial('test-id');

      expect(mockApiRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: '/api/materials/test-id',
      });
    });
  });

  describe('updateStock', () => {
    it('should update material stock', async () => {
      const mockResponse = {
        id: 'test-id',
        name: 'Test Material',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 15,
        isActive: true,
      };

      mockApiRequest.mockResolvedValue(mockResponse);

      const result = await apiClient.updateStock('test-id', 15);

      expect(mockApiRequest).toHaveBeenCalledWith({
        method: 'PATCH',
        url: '/api/materials/test-id/stock',
        data: { quantity: 15 },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});

describe('Mapper functions', () => {
  describe('mapDtoToMaterial', () => {
    it('should map DTO to Material entity', () => {
      const dto = {
        id: 'test-id',
        name: 'Test Material',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 10,
        isActive: true,
        description: 'Test description',
      };

      const material = mapDtoToMaterial(dto);

      expect(material).toBeInstanceOf(Material);
      expect(material.id).toBe(dto.id);
      expect(material.name).toBe(dto.name);
      expect(material.type).toBe(dto.type);
    });
  });

  describe('mapMaterialToDto', () => {
    it('should map Material entity to DTO', () => {
      const material = new Material({
        id: 'test-id',
        name: 'Test Material',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 10,
        isActive: true,
        description: 'Test description',
      });

      const dto = mapMaterialToDto(material);

      expect(dto.id).toBe(material.id);
      expect(dto.name).toBe(material.name);
      expect(dto.type).toBe(material.type);
      expect(dto.description).toBe(material.description);
    });
  });
});
