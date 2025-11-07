import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../utils/test-utils';
import { MaterialsList } from '../../../../src/presentation/components/materials/MaterialsList';
import { Material, MaterialType } from '../../../../src/domain/entities/Material';

describe('MaterialsList Component', () => {
  const createTestMaterials = (): Material[] => {
    return [
      new Material({
        id: 'mat-001',
        name: 'Plywood 18mm',
        type: MaterialType.WOOD,
        width: 2440,
        height: 1220,
        thickness: 18,
        pricePerSquareMeter: 45.50,
        availableQuantity: 10,
        isActive: true,
      }),
      new Material({
        id: 'mat-002',
        name: 'Steel Sheet 2mm',
        type: MaterialType.METAL,
        width: 2000,
        height: 1000,
        thickness: 2,
        pricePerSquareMeter: 80,
        availableQuantity: 5,
        isActive: true,
      }),
      new Material({
        id: 'mat-003',
        name: 'Acrylic 5mm',
        type: MaterialType.PLASTIC,
        width: 1500,
        height: 1000,
        thickness: 5,
        pricePerSquareMeter: 60,
        availableQuantity: 0,
        isActive: false,
      }),
    ];
  };

  it('should render materials in grid view by default', () => {
    const materials = createTestMaterials();
    render(<MaterialsList materials={materials} />);

    expect(screen.getByText('Plywood 18mm')).toBeInTheDocument();
    expect(screen.getByText('Steel Sheet 2mm')).toBeInTheDocument();
    expect(screen.getByText('Acrylic 5mm')).toBeInTheDocument();
  });

  it('should show empty state when no materials', () => {
    render(<MaterialsList materials={[]} />);

    expect(screen.getByText(/no materials found/i)).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<MaterialsList materials={[]} loading />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should switch between grid and list view', () => {
    const materials = createTestMaterials();
    render(<MaterialsList materials={materials} />);

    const listViewButton = screen.getByRole('button', { name: /list view/i });
    fireEvent.click(listViewButton);

    // In list view, materials should be in a table
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should call onEdit when edit is clicked', () => {
    const materials = createTestMaterials();
    const onEdit = vi.fn();
    
    render(<MaterialsList materials={materials} onEdit={onEdit} />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(onEdit).toHaveBeenCalledWith(materials[0]);
  });

  it('should call onDelete when delete is clicked', () => {
    const materials = createTestMaterials();
    const onDelete = vi.fn();
    
    render(<MaterialsList materials={materials} onDelete={onDelete} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(onDelete).toHaveBeenCalledWith('mat-001');
  });

  it('should call onView when material card is clicked', () => {
    const materials = createTestMaterials();
    const onView = vi.fn();
    
    render(<MaterialsList materials={materials} onView={onView} />);

    const cards = screen.getAllByTestId('material-card');
    fireEvent.click(cards[0]);

    expect(onView).toHaveBeenCalledWith(materials[0]);
  });

  it('should show total count', () => {
    const materials = createTestMaterials();
    render(<MaterialsList materials={materials} />);

    expect(screen.getByText(/3 materials/i)).toBeInTheDocument();
  });

  it('should handle pagination', () => {
    const materials = Array.from({ length: 15 }, (_, i) =>
      new Material({
        id: `mat-${i}`,
        name: `Material ${i}`,
        type: MaterialType.WOOD,
        width: 2000,
        height: 1000,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 10,
        isActive: true,
      })
    );

    render(<MaterialsList materials={materials} pageSize={10} />);

    // Should show pagination controls
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    
    // Should show first 10 materials
    expect(screen.getByText('Material 0')).toBeInTheDocument();
    expect(screen.queryByText('Material 10')).not.toBeInTheDocument();
  });

  it('should change page when pagination is clicked', () => {
    const materials = Array.from({ length: 15 }, (_, i) =>
      new Material({
        id: `mat-${i}`,
        name: `Material ${i}`,
        type: MaterialType.WOOD,
        width: 2000,
        height: 1000,
        thickness: 18,
        pricePerSquareMeter: 50,
        availableQuantity: 10,
        isActive: true,
      })
    );

    render(<MaterialsList materials={materials} pageSize={10} />);

    const nextButton = screen.getByRole('button', { name: /next page/i });
    fireEvent.click(nextButton);

    // Should show materials from page 2
    expect(screen.getByText('Material 10')).toBeInTheDocument();
    expect(screen.queryByText('Material 0')).not.toBeInTheDocument();
  });

  it('should show selected materials count', () => {
    const materials = createTestMaterials();
    render(<MaterialsList materials={materials} selectable />);

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[0]); // Select first material

    expect(screen.getByText(/1 selected/i)).toBeInTheDocument();
  });

  it('should select all materials', () => {
    const materials = createTestMaterials();
    const onSelectionChange = vi.fn();
    
    render(
      <MaterialsList
        materials={materials}
        selectable
        onSelectionChange={onSelectionChange}
      />
    );

    const selectAllCheckbox = screen.getByRole('checkbox', { name: /select all/i });
    fireEvent.click(selectAllCheckbox);

    expect(onSelectionChange).toHaveBeenCalledWith(materials.map(m => m.id));
  });
});