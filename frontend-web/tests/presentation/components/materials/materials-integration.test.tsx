import { describe, it, expect } from 'vitest';
import { Material, MaterialType } from '../../../../src/domain/entities/Material';

describe('Materials Integration Test', () => {
  it('should create a material entity', () => {
    const material = new Material({
      id: 'test-001',
      name: 'Test Material',
      type: MaterialType.WOOD,
      width: 2000,
      height: 1000,
      thickness: 18,
      pricePerSquareMeter: 50,
      availableQuantity: 10,
      isActive: true,
    });

    expect(material.id).toBe('test-001');
    expect(material.name).toBe('Test Material');
    expect(material.type).toBe(MaterialType.WOOD);
  });

  it('should calculate area correctly', () => {
    const material = new Material({
      id: 'test-002',
      name: 'Test Material',
      type: MaterialType.WOOD,
      width: 2000,
      height: 1000,
      thickness: 18,
      pricePerSquareMeter: 50,
      availableQuantity: 10,
      isActive: true,
    });

    const area = material.calculateArea();
    expect(area).toBe(2.0); // 2000 * 1000 / 1000000 = 2 m²
  });

  it('should check availability correctly', () => {
    const availableMaterial = new Material({
      id: 'test-003',
      name: 'Available Material',
      type: MaterialType.WOOD,
      width: 2000,
      height: 1000,
      thickness: 18,
      pricePerSquareMeter: 50,
      availableQuantity: 10,
      isActive: true,
    });

    const unavailableMaterial = new Material({
      id: 'test-004',
      name: 'Unavailable Material',
      type: MaterialType.WOOD,
      width: 2000,
      height: 1000,
      thickness: 18,
      pricePerSquareMeter: 50,
      availableQuantity: 0,
      isActive: true,
    });

    expect(availableMaterial.isAvailable()).toBe(true);
    expect(unavailableMaterial.isAvailable()).toBe(false);
  });
});