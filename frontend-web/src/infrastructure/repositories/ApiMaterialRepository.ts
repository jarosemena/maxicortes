import { IMaterialRepository } from '../../domain/repositories/IMaterialRepository';
import { Material, MaterialType } from '../../domain/entities/Material';
import {
  materialsApi,
  mapDtoToMaterial,
  mapMaterialToDto,
  MaterialFilters as ApiFilters,
} from '../api/materialsApi';

export interface MaterialFilters {
  type?: MaterialType;
  isActive?: boolean;
  search?: string;
}

export class ApiMaterialRepository implements IMaterialRepository {
  async findAll(filters?: MaterialFilters): Promise<Material[]> {
    const apiFilters: ApiFilters = {
      type: filters?.type,
      isActive: filters?.isActive,
      search: filters?.search,
      page: 1,
      pageSize: 1000, // Get all for now, implement pagination later
    };

    const response = await materialsApi.getMaterials(apiFilters);
    return response.data.map(mapDtoToMaterial);
  }

  async findById(id: string): Promise<Material | null> {
    try {
      const dto = await materialsApi.getMaterialById(id);
      return mapDtoToMaterial(dto);
    } catch (error) {
      // If 404, return null
      return null;
    }
  }

  async findByType(type: MaterialType): Promise<Material[]> {
    return this.findAll({ type });
  }

  async findAvailable(): Promise<Material[]> {
    return this.findAll({ isActive: true });
  }

  async search(query: string): Promise<Material[]> {
    return this.findAll({ search: query });
  }

  async create(material: Material): Promise<Material> {
    const dto = mapMaterialToDto(material);
    const { id, ...createData } = dto; // Remove id for creation
    const created = await materialsApi.createMaterial(createData);
    return mapDtoToMaterial(created);
  }

  async update(material: Material): Promise<Material> {
    const dto = mapMaterialToDto(material);
    const { id, ...updateData } = dto;
    const updated = await materialsApi.updateMaterial(id, updateData);
    return mapDtoToMaterial(updated);
  }

  async delete(id: string): Promise<void> {
    await materialsApi.deleteMaterial(id);
  }

  async updateStock(id: string, quantity: number): Promise<Material> {
    const updated = await materialsApi.updateStock(id, quantity);
    return mapDtoToMaterial(updated);
  }

  async exists(id: string): Promise<boolean> {
    const material = await this.findById(id);
    return material !== null;
  }

  async count(): Promise<number> {
    const materials = await this.findAll();
    return materials.length;
  }

  async save(material: Material): Promise<Material> {
    // Check if material exists
    const exists = await this.exists(material.id);
    if (exists) {
      return this.update(material);
    } else {
      return this.create(material);
    }
  }

  async findLowStock(threshold: number = 5): Promise<Material[]> {
    const materials = await this.findAll();
    return materials.filter(m => m.availableQuantity <= threshold);
  }
}
