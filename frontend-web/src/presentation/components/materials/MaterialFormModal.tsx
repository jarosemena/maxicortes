import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MaterialForm } from './MaterialForm';
import { Material } from '../../../domain/entities/Material';
import { MaterialFormData } from '../../validation/materialSchema';
import { useMaterialsStore } from '../../../application/stores/useMaterialsStore';
import { useUIStore } from '../../../application/stores/useUIStore';
import { CreateMaterialUseCase } from '../../../domain/use-cases/materials/CreateMaterialUseCase';
import { UpdateMaterialUseCase } from '../../../domain/use-cases/materials/UpdateMaterialUseCase';
import { MaterialRepository } from '../../../infrastructure/repositories/MaterialRepository';

const materialRepository = new MaterialRepository();
const createMaterialUseCase = new CreateMaterialUseCase(materialRepository);
const updateMaterialUseCase = new UpdateMaterialUseCase(materialRepository);

export interface MaterialFormModalProps {
  open: boolean;
  onClose: () => void;
  material?: Material;
  mode: 'create' | 'edit';
}

export const MaterialFormModal: React.FC<MaterialFormModalProps> = ({
  open,
  onClose,
  material,
  mode,
}) => {
  const { addMaterial, updateMaterial } = useMaterialsStore();
  const { showSuccess, showError } = useUIStore();
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (data: MaterialFormData) => {
    try {
      if (mode === 'create') {
        const newMaterial = await createMaterialUseCase.execute(data);
        addMaterial(newMaterial);
        showSuccess('Material created successfully');
      } else if (mode === 'edit' && material) {
        const updatedMaterial = await updateMaterialUseCase.execute(material.id, data);
        updateMaterial(updatedMaterial);
        showSuccess('Material updated successfully');
      }
      onClose();
    } catch (error) {
      showError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleSave = () => {
    if (formRef.current) {
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true })
      );
    }
  };

  const actions = (
    <>
      <Button onClick={onClose} variant="outlined">
        Cancel
      </Button>
      <Button onClick={handleSave} variant="contained" color="primary">
        {mode === 'create' ? 'Create' : 'Save'}
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Create Material' : 'Edit Material'}
      size="medium"
      actions={actions}
    >
      <MaterialForm
        initialData={material}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};