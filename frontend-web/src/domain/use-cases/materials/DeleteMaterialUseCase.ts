import { IMaterialRepository } from '../../repositories/IMaterialRepository';

export class DeleteMaterialUseCase {
  constructor(private readonly materialRepository: IMaterialRepository) {}

  async execute(id: string): Promise<void> {
    // Verify material exists
    const existingMaterial = await this.materialRepository.findById(id);
    if (!existingMaterial) {
      throw new Error('Material not found');
    }

    // Delete material
    await this.materialRepository.delete(id);
  }
}