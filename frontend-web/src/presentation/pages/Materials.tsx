import React, { useState, useMemo } from 'react';
import { Box, Typography, Button, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import {
  useMaterials,
  useDeleteMaterial,
  UseMaterialsFilters,
} from '../../application/hooks/useMaterialsApi';
import { useMaterialsStore } from '../../application/stores/useMaterialsStore';
import { MaterialsList } from '../components/materials/MaterialsList';
import { MaterialFilters } from '../components/materials/MaterialFilters';
import { MaterialFormModal } from '../components/materials/MaterialFormModal';
import { Material } from '../../domain/entities/Material';
import { Loading } from '../components/ui/Loading';

const MaterialsPage: React.FC = () => {
  const { filters, updateFilters, resetFilters } = useMaterialsStore();

  // Convert store filters to API filters (null -> undefined)
  const apiFilters: UseMaterialsFilters = useMemo(
    () => ({
      type: filters.type || undefined,
      isActive: filters.availableOnly ? true : undefined,
      search: filters.search || undefined,
    }),
    [filters]
  );

  const { data: materials = [], isLoading, error } = useMaterials(apiFilters);
  const deleteMaterial = useDeleteMaterial();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<
    Material | undefined
  >();

  const handleCreate = () => {
    setCreateModalOpen(true);
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      await deleteMaterial.mutateAsync(id);
    }
  };

  const handleView = (material: Material) => {
    setSelectedMaterial(material);
    setEditModalOpen(true);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error loading materials: {error.message}
        </Typography>
      </Box>
    );
  }

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
            Manage your materials inventory ({materials.length} total)
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
        loading={deleteMaterial.isPending}
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
