import { Material, MaterialType } from '../../entities/Material';
import { IMaterialRepository } from '../../repositories/IMaterialRepository';

export class GetMaterialsUseCase {
  constructor(private readonly materialRepository: IMaterialRepository) {}

  /**
   * Get all materials
   */
  async execute(): Promise<Material[]> {
    return this.materialRepository.findAll();
  }

  /**
   * Get materials by type
   */
  async executeByType(type: MaterialType): Promise<Material[]> {
    return this.materialRepository.findByType(type);
  }

  /**
   * Get only available materials
   */
  async executeAvailable(): Promise<Material[]> {
    return this.materialRepository.findAvailable();
  }

  /**
   * Search materials by query
   */
  async executeSearch(query: string): Promise<Material[]> {
    if (!query || query.trim() === '') {
      throw new Error('Search query cannot be empty');
    }

    return this.materialRepository.search(query.trim());
  }

  /**
   * Get materials with low stock
   */
  async executeLowStock(threshold: number = 10): Promise<Material[]> {
    return this.materialRepository.findLowStock(threshold);
  }
}