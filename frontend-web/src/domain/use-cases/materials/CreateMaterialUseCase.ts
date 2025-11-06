import { Material, MaterialType, MaterialProps } from '../../entities/Material';
import { IMaterialRepository } from '../../repositories/IMaterialRepository';

export interface CreateMaterialRequest {
  name: string;
  type: MaterialType;
  width: number;
  height: number;
  thickness: number;
  pricePerSquareMeter: number;
  availableQuantity: number;
  isActive: boolean;
  description?: string;
  imageUrl?: string;
}

export class CreateMaterialUseCase {
  constructor(private readonly materialRepository: IMaterialRepository) {}

  async execute(request: CreateMaterialRequest): Promise<Material> {
    // Generate unique ID
    const id = this.generateMaterialId();

    // Create material props with generated ID and timestamp
    const materialProps: MaterialProps = {
      id,
      name: request.name,
      type: request.type,
      width: request.width,
      height: request.height,
      thickness: request.thickness,
      pricePerSquareMeter: request.pricePerSquareMeter,
      availableQuantity: request.availableQuantity,
      isActive: request.isActive,
      description: request.description,
      imageUrl: request.imageUrl,
      createdAt: new Date(),
    };

    // Create material entity (this will validate the data)
    const material = new Material(materialProps);

    // Save to repository
    return this.materialRepository.save(material);
  }

  private generateMaterialId(): string {
    // Generate a unique ID with timestamp and random component
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `mat-${timestamp}-${random}`;
  }
}