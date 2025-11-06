import { Material, MaterialType } from '../entities/Material';

export interface IMaterialRepository {
  /**
   * Find all materials
   */
  findAll(): Promise<Material[]>;

  /**
   * Find material by ID
   */
  findById(id: string): Promise<Material | null>;

  /**
   * Find materials by type
   */
  findByType(type: MaterialType): Promise<Material[]>;

  /**
   * Find only available materials (active and with stock)
   */
  findAvailable(): Promise<Material[]>;

  /**
   * Save material (create or update)
   */
  save(material: Material): Promise<Material>;

  /**
   * Delete material by ID
   */
  delete(id: string): Promise<void>;

  /**
   * Update material stock quantity
   */
  updateStock(id: string, quantity: number): Promise<Material>;

  /**
   * Search materials by name or description
   */
  search(query: string): Promise<Material[]>;

  /**
   * Find materials with low stock (below threshold)
   */
  findLowStock(threshold?: number): Promise<Material[]>;
}