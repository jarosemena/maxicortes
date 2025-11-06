import { describe, it, expect } from 'vitest';
import { Material, MaterialType } from '../../../src/domain/entities/Material';

// Mock implementation for testing interface contract
class MockMaterialRepository {
  private materials: Material[] = [];

  async findAll(): Promise<Material[]> {
    return [...this.materials];
  }

  async findById(id: string): Promise<Material | null> {
    return this.materials.find(m => m.id === id) || null;
  }

  async findByType(type: MaterialType): Promise<Material[]> {
    return this.materials.filter(m => m.type === type);
  }

  async findAvailable(): Promise<Material[]> {
    return this.materials.filter(m => m.isAvailable());
  }

  async save(material: Material): Promise<Material> {
    const index = this.materials.findIndex(m => m.id === material.id);
    if (index >= 0) {
      this.materials[index] = material;
    } else {
      this.materials.push(material);
    }
    return material;
  }

  async delete(id: string): Promise<void> {
    this.materials = this.materials.filter(m => m.id !== id);
  }

  async updateStock(id: string, quantity: number): Promise<Material> {
    const material = await this.findById(id);
    if (!material) {
      throw new Error('Material not found');
    }
    
    const updatedMaterial = material.update({ availableQuantity: quantity });
    return this.save(updatedMaterial);
  }
}

describe('IMaterialRepository Contract', () => {
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

  it('should find all materials', async () => {
    const repository = new MockMaterialRepository();
    const material = createTestMaterial();
    await repository.save(material);

    const materials = await repository.findAll();
    expect(materials).toHaveLength(1);
    expect(materials[0].id).toBe(material.id);
  });

  it('should find material by id', async () => {
    const repository = new MockMaterialRepository();
    const material = createTestMaterial();
    await repository.save(material);

    const found = await repository.findById(material.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(material.id);
  });

  it('should return null for non-existent material', async () => {
    const repository = new MockMaterialRepository();
    
    const found = await repository.findById('non-existent');
    expect(found).toBeNull();
  });

  it('should find materials by type', async () => {
    const repository = new MockMaterialRepository();
    const woodMaterial = createTestMaterial('wood-1');
    const metalMaterial = new Material({
      id: 'metal-1',
      name: 'Metal Sheet',
      type: MaterialType.METAL,
      width: 2000,
      height: 1000,
      thickness: 2,
      pricePerSquareMeter: 80,
      availableQuantity: 5,
      isActive: true,
    });

    await repository.save(woodMaterial);
    await repository.save(metalMaterial);

    const woodMaterials = await repository.findByType(MaterialType.WOOD);
    expect(woodMaterials).toHaveLength(1);
    expect(woodMaterials[0].type).toBe(MaterialType.WOOD);
  });

  it('should find only available materials', async () => {
    const repository = new MockMaterialRepository();
    const availableMaterial = createTestMaterial('available');
    const unavailableMaterial = new Material({
      id: 'unavailable',
      name: 'Unavailable Material',
      type: MaterialType.WOOD,
      width: 2000,
      height: 1000,
      thickness: 18,
      pricePerSquareMeter: 50,
      availableQuantity: 0, // No stock
      isActive: true,
    });

    await repository.save(availableMaterial);
    await repository.save(unavailableMaterial);

    const available = await repository.findAvailable();
    expect(available).toHaveLength(1);
    expect(available[0].id).toBe('available');
  });

  it('should save new material', async () => {
    const repository = new MockMaterialRepository();
    const material = createTestMaterial();

    const saved = await repository.save(material);
    expect(saved.id).toBe(material.id);

    const found = await repository.findById(material.id);
    expect(found).toBeDefined();
  });

  it('should update existing material', async () => {
    const repository = new MockMaterialRepository();
    const material = createTestMaterial();
    await repository.save(material);

    const updatedMaterial = material.update({ name: 'Updated Name' });
    await repository.save(updatedMaterial);

    const found = await repository.findById(material.id);
    expect(found?.name).toBe('Updated Name');
  });

  it('should delete material', async () => {
    const repository = new MockMaterialRepository();
    const material = createTestMaterial();
    await repository.save(material);

    await repository.delete(material.id);

    const found = await repository.findById(material.id);
    expect(found).toBeNull();
  });

  it('should update material stock', async () => {
    const repository = new MockMaterialRepository();
    const material = createTestMaterial();
    await repository.save(material);

    const updated = await repository.updateStock(material.id, 20);
    expect(updated.availableQuantity).toBe(20);
  });

  it('should throw error when updating stock of non-existent material', async () => {
    const repository = new MockMaterialRepository();

    await expect(repository.updateStock('non-existent', 10))
      .rejects.toThrow('Material not found');
  });
});