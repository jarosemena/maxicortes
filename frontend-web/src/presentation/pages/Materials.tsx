import React, { useState } from 'react';
import { Box, Typography, Button, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMaterialsStore } from '../../application/stores/useMaterialsStore';
import { useUIStore } from '../../application/stores/useUIStore';
import { MaterialsList } from '../components/materials/MaterialsList';
import { MaterialFilters } from '../components/materials/MaterialFilters';
import { MaterialFormModal } from '../components/materials/MaterialFormModal';
import { Material } from '../../domain/entities/Material';

const MaterialsPage: React.FC = () => {
  const { getFilteredMaterials, filters, updateFilters, resetFilters, removeMaterial } =
    useMaterialsStore();
  const { showSuccess } = useUIStore();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>();

  const materials = getFilteredMaterials();

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setEditModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      removeMaterial(id);
      showSuccess('Material deleted successfully');
    }
  };

  const handleView = (material: Material) => {
    setSelectedMaterial(material);
    setEditModalOpen(true);
  };

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Materials Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your materials inventory
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          Add Material
        </Button>
      </Box>

      <MaterialFilters
        filters={filters}
        onFiltersChange={updateFilters}
        onReset={resetFilters}
      />

      <MaterialsList
        materials={materials}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      {/* Floating Action Button for mobile */}
      <Fab
        color="primary"
        aria-label="add material"
        onClick={handleCreate}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' },
        }}
      >
        <AddIcon />
      </Fab>

      {/* Create Material Modal */}
      <MaterialFormModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        mode="create"
      />

      {/* Edit Material Modal */}
      <MaterialFormModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedMaterial(undefined);
        }}
        material={selectedMaterial}
        mode="edit"
      />
    </Box>
  );
};

export default MaterialsPage;