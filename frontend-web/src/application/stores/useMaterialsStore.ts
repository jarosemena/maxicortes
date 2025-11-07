import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Material, MaterialType } from '../../domain/entities/Material';

export interface MaterialFilters {
  search: string;
  type: MaterialType | null;
  availableOnly: boolean;
}

interface MaterialsState {
  // State
  materials: Material[];
  selectedMaterial: Material | null;
  isLoading: boolean;
  error: string | null;
  filters: MaterialFilters;

  // Actions
  setMaterials: (materials: Material[]) => void;
  addMaterial: (material: Material) => void;
  updateMaterial: (material: Material) => void;
  removeMaterial: (id: string) => void;
  setSelectedMaterial: (material: Material | null) => void;
  clearSelectedMaterial: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  updateFilters: (filters: Partial<MaterialFilters>) => void;
  resetFilters: () => void;
  getFilteredMaterials: () => Material[];
  reset: () => void;
}

const initialState = {
  materials: [],
  selectedMaterial: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    type: null,
    availableOnly: false,
  },
};

export const useMaterialsStore = create<MaterialsState>()(
  persist(
    immer((set, get) => ({
      ...initialState,

      setMaterials: (materials: Material[]) =>
        set((state) => {
          state.materials = materials;
        }),

      addMaterial: (material: Material) =>
        set((state) => {
          state.materials.push(material);
        }),

      updateMaterial: (updatedMaterial: Material) =>
        set((state) => {
          const index = state.materials.findIndex(m => m.id === updatedMaterial.id);
          if (index !== -1) {
            state.materials[index] = updatedMaterial;
          }
        }),

      removeMaterial: (id: string) =>
        set((state) => {
          state.materials = state.materials.filter(m => m.id !== id);
          if (state.selectedMaterial?.id === id) {
            state.selectedMaterial = null;
          }
        }),

      setSelectedMaterial: (material: Material | null) =>
        set((state) => {
          state.selectedMaterial = material;
        }),

      clearSelectedMaterial: () =>
        set((state) => {
          state.selectedMaterial = null;
        }),

      setLoading: (loading: boolean) =>
        set((state) => {
          state.isLoading = loading;
        }),

      setError: (error: string | null) =>
        set((state) => {
          state.error = error;
        }),

      clearError: () =>
        set((state) => {
          state.error = null;
        }),

      updateFilters: (newFilters: Partial<MaterialFilters>) =>
        set((state) => {
          state.filters = { ...state.filters, ...newFilters };
        }),

      resetFilters: () =>
        set((state) => {
          state.filters = {
            search: '',
            type: null,
            availableOnly: false,
          };
        }),

      getFilteredMaterials: () => {
        const { materials, filters } = get();
        
        return materials.filter((material) => {
          // Search filter
          if (filters.search && !material.name.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
          }

          // Type filter
          if (filters.type && material.type !== filters.type) {
            return false;
          }

          // Available only filter
          if (filters.availableOnly && !material.isAvailable()) {
            return false;
          }

          return true;
        });
      },

      reset: () =>
        set((state) => {
          Object.assign(state, initialState);
        }),
    })),
    {
      name: 'maxicortes-materials-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        materials: state.materials,
        filters: state.filters,
      }),
    }
  )
);