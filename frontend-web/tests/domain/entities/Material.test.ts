import { describe, it, expect } from 'vitest';
import { Material, MaterialType } from '@/domain/entities/Material';

describe('Material Entity', () => {
  describe('constructor', () => {
    it('should create a material with valid properties', () => {
      const material = new Material({
        id: 'mat-001',
        name: 'Plywood 18mm',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 45.50,
        availableQuantity: 10,
        isActive: true,
      });

      expect(material.id).toBe('mat-001');
      expect(material.name).toBe('Plywood 18mm');
      expect(material.type).toBe(MaterialType.WOOD);
      expect(material.width).toBe(2440);
      expect(material.height).toBe(1220);
      expect(material.thickness).toBe(18);
      expect(material.pricePerSquareMeter).toBe(45.50);
      expect(material.availableQuantity).toBe(10);
      expect(material.isActive).toBe(true);
    });

    it('should throw error for invalid dimensions', () => {
      expect(() => {
        new Material({
          id: 'mat-001',
          name: 'Invalid Material',
          type: MaterialType.WOOD,
          width: -100,
          height: 1220,
          thickness: 18,
          pricePerSquareMeter: 45.50,
          availableQuantity: 10,
          isActive: true,
        });
      }).toThrow('Width must be positive');
    });

    it('should throw error for invalid price', () => {
      expect(() => {
        new Material({
          id: 'mat-001',
          name: 'Invalid Material',
          type: MaterialType.WOOD,
          width: 2440,
          height: 1220,
          thickness: 18,
          pricePerSquareMeter: -10,
          availableQuantity: 10,
          isActive: true,
        });
      }).toThrow('Price per square meter must be positive');
    });
  });

  describe('calculateArea', () => {
    it('should calculate area correctly', () => {
      const material = new Material({
        id: 'mat-001',
        name: 'Test Material',
        type: MaterialType.WOOD,
        width: 2000,
        height: 1000,
        thickness: 18,
        pricePerSquareMeter: 45.50,
        availableQuantity: 10,
        isActive: true,
      });

      expect(material.calculateArea()).toBe(2.0); // 2000 * 1000 / 1000000 = 2 m²
    });
  });

  describe('calculateTotalValue', () => {
    it('should calculate total value correctly', () => {
      const material = new Material({
        id: 'mat-001',
        name: 'Test Material',
        type: MaterialType.WOOD,
        width: 2000,
        height: 1000,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 5,
        isActive: true,
      });

      expect(material.calculateTotalValue()).toBe(500); // 2 m² * 50 * 5 = 500
    });
  });

  describe('isAvailable', () => {
    it('should return true when material is active and has quantity', () => {
      const material = new Material({
        id: 'mat-001',
        name: 'Test Material',
        type: MaterialType.WOOD,
        width: 2000,
        height: 1000,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 5,
        isActive: true,
      });

      expect(material.isAvailable()).toBe(true);
    });

    it('should return false when material is inactive', () => {
      const material = new Material({
        id: 'mat-001',
        name: 'Test Material',
        type: MaterialType.WOOD,
        width: 2000,
        height: 1000,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 5,
        isActive: false,
      });

      expect(material.isAvailable()).toBe(false);
    });

    it('should return false when material has no quantity', () => {
      const material = new Material({
        id: 'mat-001',
        name: 'Test Material',
        type: MaterialType.WOOD,
        width: 2000,
        height: 1000,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 0,
        isActive: true,
      });

      expect(material.isAvailable()).toBe(false);
    });
  });
});