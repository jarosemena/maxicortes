import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Material, MaterialType } from '../../domain/entities/Material';
import { GetMaterialsUseCase } from '../../domain/use-cases/materials/GetMaterialsUseCase';
import { CreateMaterialUseCase, CreateMaterialRequest } from '../../domain/use-cases/materials/CreateMaterialUseCase';
import { UpdateMaterialUseCase, UpdateMaterialRequest } from '../../domain/use-cases/materials/UpdateMaterialUseCase';
import { DeleteMaterialUseCase } from '../../domain/use-cases/materials/DeleteMaterialUseCase';
import { MaterialRepository } from '../../infrastructure/repositories/MaterialRepository';

// Repository instance - in a real app, this would be injected via DI
const materialRepository = new MaterialRepository();

// Use cases
const getMaterialsUseCase = new GetMaterialsUseCase(materialRepository);
const createMaterialUseCase = new CreateMaterialUseCase(materialRepository);
const updateMaterialUseCase = new UpdateMaterialUseCase(materialRepository);
const deleteMaterialUseCase = new DeleteMaterialUseCase(materialRepository);

// Query keys
export const materialKeys = {
  all: ['materials'] as const,
  lists: () => [...materialKeys.all, 'list'] as const,
  list: (filters: string) => [...materialKeys.lists(), { filters }] as const,
  details: () => [...materialKeys.all, 'detail'] as const,
  detail: (id: string) => [...materialKeys.details(), id] as const,
  byType: (type: MaterialType) => [...materialKeys.all, 'byType', type] as const,
  available: () => [...materialKeys.all, 'available'] as const,
  search: (query: string) => [...materialKeys.all, 'search', query] as const,
};

// Queries
export const useMaterialsQuery = () => {
  return useQuery({
    queryKey: materialKeys.lists(),
    queryFn: () => getMaterialsUseCase.execute(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useMaterialQuery = (id: string) => {
  return useQuery({
    queryKey: materialKeys.detail(id),
    queryFn: async () => {
      const material = await materialRepository.findById(id);
      if (!material) {
        throw new Error('Material not found');
      }
      return material;
    },
    enabled: !!id,
  });
};

export const useMaterialsByTypeQuery = (type: MaterialType) => {
  return useQuery({
    queryKey: materialKeys.byType(type),
    queryFn: () => getMaterialsUseCase.executeByType(type),
  });
};

export const useAvailableMaterialsQuery = () => {
  return useQuery({
    queryKey: materialKeys.available(),
    queryFn: () => getMaterialsUseCase.executeAvailable(),
  });
};

export const useMaterialsSearchQuery = (query: string) => {
  return useQuery({
    queryKey: materialKeys.search(query),
    queryFn: () => getMaterialsUseCase.executeSearch(query),
    enabled: query.length > 0,
  });
};

// Mutations
export const useCreateMaterialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMaterialRequest) => createMaterialUseCase.execute(data),
    onSuccess: (newMaterial) => {
      // Invalidate and refetch materials list
      queryClient.invalidateQueries({ queryKey: materialKeys.lists() });
      
      // Add the new material to the cache
      queryClient.setQueryData(materialKeys.detail(newMaterial.id), newMaterial);
      
      // Optimistically update the materials list
      queryClient.setQueryData(materialKeys.lists(), (old: Material[] = []) => {
        return [...old, newMaterial];
      });
    },
  });
};

export const useUpdateMaterialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMaterialRequest }) =>
      updateMaterialUseCase.execute(id, data),
    onSuccess: (updatedMaterial) => {
      // Update the material in the cache
      queryClient.setQueryData(materialKeys.detail(updatedMaterial.id), updatedMaterial);
      
      // Update the materials list
      queryClient.setQueryData(materialKeys.lists(), (old: Material[] = []) => {
        return old.map(material => 
          material.id === updatedMaterial.id ? updatedMaterial : material
        );
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: materialKeys.byType(updatedMaterial.type) });
      queryClient.invalidateQueries({ queryKey: materialKeys.available() });
    },
  });
};

export const useDeleteMaterialMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteMaterialUseCase.execute(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: materialKeys.detail(deletedId) });
      
      // Update the materials list
      queryClient.setQueryData(materialKeys.lists(), (old: Material[] = []) => {
        return old.filter(material => material.id !== deletedId);
      });
      
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: materialKeys.all });
    },
  });
};

export const useUpdateMaterialStockMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      materialRepository.updateStock(id, quantity),
    onSuccess: (updatedMaterial) => {
      // Update the material in the cache
      queryClient.setQueryData(materialKeys.detail(updatedMaterial.id), updatedMaterial);
      
      // Update the materials list
      queryClient.setQueryData(materialKeys.lists(), (old: Material[] = []) => {
        return old.map(material => 
          material.id === updatedMaterial.id ? updatedMaterial : material
        );
      });
      
      // Invalidate availability queries
      queryClient.invalidateQueries({ queryKey: materialKeys.available() });
    },
  });
};