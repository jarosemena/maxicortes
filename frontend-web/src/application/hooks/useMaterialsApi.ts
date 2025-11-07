import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Material, MaterialType } from '../../domain/entities/Material';
import { ApiMaterialRepository } from '../../infrastructure/repositories/ApiMaterialRepository';
import { useUIStore } from '../stores/useUIStore';

// Query keys
export const MATERIALS_QUERY_KEY = 'materials';

// Repository instance
const materialRepository = new ApiMaterialRepository();

// Filters interface
export interface UseMaterialsFilters {
  type?: MaterialType;
  isActive?: boolean;
  search?: string;
}

// Hook to fetch all materials
export const useMaterials = (filters?: UseMaterialsFilters) => {
  return useQuery({
    queryKey: [MATERIALS_QUERY_KEY, filters],
    queryFn: () => materialRepository.findAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  });
};

// Hook to fetch a single material
export const useMaterial = (id: string) => {
  return useQuery({
    queryKey: [MATERIALS_QUERY_KEY, id],
    queryFn: () => materialRepository.findById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// Hook to create a material
export const useCreateMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (material: Material) => materialRepository.create(material),
    onSuccess: (newMaterial) => {
      // Invalidate and refetch materials list
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] });
      showSuccess(`Material "${newMaterial.name}" created successfully`);
    },
    onError: (error: Error) => {
      showError(`Failed to create material: ${error.message}`);
    },
  });
};

// Hook to update a material
export const useUpdateMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (material: Material) => materialRepository.update(material),
    onSuccess: (updatedMaterial) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY, updatedMaterial.id] });
      showSuccess(`Material "${updatedMaterial.name}" updated successfully`);
    },
    onError: (error: Error) => {
      showError(`Failed to update material: ${error.message}`);
    },
  });
};

// Hook to delete a material
export const useDeleteMaterial = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: (id: string) => materialRepository.delete(id),
    onSuccess: () => {
      // Invalidate materials list
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] });
      showSuccess('Material deleted successfully');
    },
    onError: (error: Error) => {
      showError(`Failed to delete material: ${error.message}`);
    },
  });
};

// Hook to update material stock
export const useUpdateMaterialStock = () => {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useUIStore();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      materialRepository.updateStock(id, quantity),
    onSuccess: (updatedMaterial) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [MATERIALS_QUERY_KEY, updatedMaterial.id] });
      showSuccess('Stock updated successfully');
    },
    onError: (error: Error) => {
      showError(`Failed to update stock: ${error.message}`);
    },
  });
};

// Hook to prefetch materials (useful for optimization)
export const usePrefetchMaterials = () => {
  const queryClient = useQueryClient();

  return (filters?: UseMaterialsFilters) => {
    queryClient.prefetchQuery({
      queryKey: [MATERIALS_QUERY_KEY, filters],
      queryFn: () => materialRepository.findAll(filters),
      staleTime: 5 * 60 * 1000,
    });
  };
};
