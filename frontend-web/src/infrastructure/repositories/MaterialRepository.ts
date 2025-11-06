import { Material, MaterialType } from '../../domain/entities/Material';
import { IMaterialRepository } from '../../domain/repositories/IMaterialRepository';

// Mock implementation for now - will be replaced with real API calls
export class MaterialRepository implements IMaterialRepository {
  private materials: Material[] = [];

  async findAll(): Promise<Material[]> {
    // Simulate API delay
    await this.delay(100);
    return [...this.materials];
  }

  async findById(id: string): Promise<Material | null> {
    await this.delay(50);
    return this.materials.find(m => m.id === id) || null;
  }

  async findByType(type: MaterialType): Promise<Material[]> {
    await this.delay(100);
    return this.materials.filter(m => m.type === type);
  }

  async findAvailable(): Promise<Material[]> {
    await this.delay(100);
    return this.materials.filter(m => m.isAvailable());
  }

  async save(material: Material): Promise<Material> {
    await this.delay(200);
    
    const existingIndex = this.materials.findIndex(m => m.id === material.id);
    if (existingIndex >= 0) {
      this.materials[existingIndex] = material;
    } else {
      this.materials.push(material);
    }
    
    return material;
  }

  async delete(id: string): Promise<void> {
    await this.delay(100);
    this.materials = this.materials.filter(m => m.id !== id);
  }

  async updateStock(id: string, quantity: number): Promise<Material> {
    await this.delay(100);
    
    const material = await this.findById(id);
    if (!material) {
      throw new Error('Material not found');
    }
    
    const updatedMaterial = material.update({ 
      availableQuantity: quantity,
      updatedAt: new Date(),
    });
    
    return this.save(updatedMaterial);
  }

  async search(query: string): Promise<Material[]> {
    await this.delay(150);
    
    const searchTerm = query.toLowerCase();
    return this.materials.filter(material => 
      material.name.toLowerCase().includes(searchTerm) ||
      (material.description && material.description.toLowerCase().includes(searchTerm))
    );
  }

  async findLowStock(threshold: number = 10): Promise<Material[]> {
    await this.delay(100);
    return this.materials.filter(m => m.availableQuantity <= threshold);
  }

  // Utility method to simulate API delay
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Development helper methods
  public seedData(materials: Material[]): void {
    this.materials = [...materials];
  }

  public clearData(): void {
    this.materials = [];
  }
}