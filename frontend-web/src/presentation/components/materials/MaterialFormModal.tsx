import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MaterialForm } from './MaterialForm';
import { Material } from '../../../domain/entities/Material';
import { MaterialFormData } from '../../validation/materialSchema';
import { useCreateMaterial, useUpdateMaterial } from '../../../application/hooks/useMaterialsApi';

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
  const createMaterial = useCreateMaterial();
  const updateMaterial = useUpdateMaterial();
  const formRef = React.useRef<HTMLFormElement>(null);

  const isLoading = createMaterial.isPending || updateMaterial.isPending;

  const handleSubmit = async (data: MaterialFormData) => {
    try {
      if (mode === 'create') {
        const newMaterial = new Material({
          id: crypto.randomUUID(),
          ...data,
        });
        await createMaterial.mutateAsync(newMaterial);
      } else if (mode === 'edit' && material) {
        const updatedMaterial = new Material({
          ...material,
          ...data,
        });
        await updateMaterial.mutateAsync(updatedMaterial);
      }
      onClose();
    } catch (error) {
      // Error handling is done in the hooks
      console.error('Error submitting material:', error);
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
      <Button onClick={onClose} variant="outlined" disabled={isLoading}>
        Cancel
      </Button>
      <Button 
        onClick={handleSave} 
        variant="contained" 
        color="primary"
        loading={isLoading}
      >
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
