import { apiRequest } from './apiClient';
import { Material, MaterialType } from '../../domain/entities/Material';

// API DTOs
export interface MaterialDto {
  id: string;
  name: string;
  type: MaterialType;
  width: number;
  height: number;
  thickness: number;
  pricePerSquareMeter: number;
  availableQuantity: number;
  isActive: boolean;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMaterialDto {
  name: string;
  type: MaterialType;
  width: number;
  height: number;
  thickness: number;
  pricePerSquareMeter: number;
  availableQuantity: number;
  isActive: boolean;
  description?: string;
}

export interface UpdateMaterialDto extends Partial<CreateMaterialDto> {}

export interface MaterialsResponse {
  data: MaterialDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface MaterialFilters {
  type?: MaterialType;
  isActive?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Mapper functions
export const mapDtoToMaterial = (dto: MaterialDto): Material => {
  return new Material({
    id: dto.id,
    name: dto.name,
    type: dto.type,
    width: dto.width,
    height: dto.height,
    thickness: dto.thickness,
    pricePerSquareMeter: dto.pricePerSquareMeter,
    availableQuantity: dto.availableQuantity,
    isActive: dto.isActive,
    description: dto.description,
  });
};

export const mapMaterialToDto = (material: Material): MaterialDto => {
  return {
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
  };
};

// Materials API Client
export class MaterialsApiClient {
  private readonly basePath = '/api/materials';

  async getMaterials(filters?: MaterialFilters): Promise<MaterialsResponse> {
    const params = new URLSearchParams();
    
    if (filters?.type) params.append('type', filters.type);
    if (filters?.isActive !== undefined) params.append('isActive', String(filters.isActive));
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', String(filters.page));
    if (filters?.pageSize) params.append('pageSize', String(filters.pageSize));
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const queryString = params.toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;

    return apiRequest<MaterialsResponse>({
      method: 'GET',
      url,
    });
  }

  async getMaterialById(id: string): Promise<MaterialDto> {
    return apiRequest<MaterialDto>({
      method: 'GET',
      url: `${this.basePath}/${id}`,
    });
  }

  async createMaterial(data: CreateMaterialDto): Promise<MaterialDto> {
    return apiRequest<MaterialDto>({
      method: 'POST',
      url: this.basePath,
      data,
    });
  }

  async updateMaterial(id: string, data: UpdateMaterialDto): Promise<MaterialDto> {
    return apiRequest<MaterialDto>({
      method: 'PUT',
      url: `${this.basePath}/${id}`,
      data,
    });
  }

  async deleteMaterial(id: string): Promise<void> {
    return apiRequest<void>({
      method: 'DELETE',
      url: `${this.basePath}/${id}`,
    });
  }

  async updateStock(id: string, quantity: number): Promise<MaterialDto> {
    return apiRequest<MaterialDto>({
      method: 'PATCH',
      url: `${this.basePath}/${id}/stock`,
      data: { quantity },
    });
  }
}

// Export singleton instance
export const materialsApi = new MaterialsApiClient();
