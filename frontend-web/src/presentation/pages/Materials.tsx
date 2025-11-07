import React, { useState } from 'react';
import { Box, Typography, Button, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useMaterialsStore } from '../../application/stores/useMaterialsStore';
import { useUIStore } from '../../application/stores/useUIStore';
import { MaterialsList } from '../components/materials/MaterialsList';
import { MaterialFilters } from '../components/materials/MaterialFilters';
import { Material } from '../../domain/entities/Material';

const MaterialsPage: React.FC = () => {
  const { getFilteredMaterials, filters, updateFilters, resetFilters } =
    useMaterialsStore();
  const { showSuccess, showError, openModal } = useUIStore();

  const materials = getFilteredMaterials();

  const handleEdit = (material: Material) => {
    openModal('edit-material', { material });
    showSuccess(`Editing ${material.name}`);
  };

  const handleDelete = (id: string) => {
    // TODO: Implement delete confirmation
    showError('Delete functionality coming soon');
  };

  const handleView = (material: Material) => {
    openModal('view-material', { material });
  };

  const handleCreate = () => {
    openModal('create-material');
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
    </Box>
  );
};

export default MaterialsPage;