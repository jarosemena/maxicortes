import { Material } from '../../entities/Material';
import { IMaterialRepository } from '../../repositories/IMaterialRepository';

export interface UpdateMaterialRequest {
  name?: string;
  pricePerSquareMeter?: number;
  availableQuantity?: number;
  isActive?: boolean;
  description?: string;
  imageUrl?: string;
}

export class UpdateMaterialUseCase {
  constructor(private readonly materialRepository: IMaterialRepository) {}

  async execute(id: string, request: UpdateMaterialRequest): Promise<Material> {
    // Find existing material
    const existingMaterial = await this.materialRepository.findById(id);
    if (!existingMaterial) {
      throw new Error('Material not found');
    }

    // Update material with new data
    const updatedMaterial = existingMaterial.update({
      ...request,
      updatedAt: new Date(),
    });

    // Save updated material
    return this.materialRepository.save(updatedMaterial);
  }
}