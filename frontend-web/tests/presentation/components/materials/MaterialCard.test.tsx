import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../utils/test-utils';
import { MaterialCard } from '../../../../src/presentation/components/materials/MaterialCard';
import { Material, MaterialType } from '../../../../src/domain/entities/Material';

describe('MaterialCard Component', () => {
  const createTestMaterial = (): Material => {
    return new Material({
      id: 'mat-001',
      name: 'Plywood 18mm',
      type: MaterialType.WOOD,
      width: 2440,
      height: 1220,
      thickness: 18,
      pricePerSquareMeter: 45.50,
      availableQuantity: 10,
      isActive: true,
      description: 'High quality plywood',
    });
  };

  it('should render material information', () => {
    const material = createTestMaterial();
    render(<MaterialCard material={material} />);

    expect(screen.getByText('Plywood 18mm')).toBeInTheDocument();
    expect(screen.getByText(/2440 x 1220 x 18 mm/i)).toBeInTheDocument();
    expect(screen.getByText(/45.50/)).toBeInTheDocument();
  });

  it('should show available quantity', () => {
    const material = createTestMaterial();
    render(<MaterialCard material={material} />);

    expect(screen.getByText(/10/)).toBeInTheDocument();
    expect(screen.getByText(/in stock/i)).toBeInTheDocument();
  });

  it('should show material type badge', () => {
    const material = createTestMaterial();
    render(<MaterialCard material={material} />);

    expect(screen.getByText('WOOD')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    const material = createTestMaterial();
    const onEdit = vi.fn();
    
    render(<MaterialCard material={material} onEdit={onEdit} />);

    const editButton = screen.getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalledWith(material);
  });

  it('should call onDelete when delete button is clicked', () => {
    const material = createTestMaterial();
    const onDelete = vi.fn();
    
    render(<MaterialCard material={material} onDelete={onDelete} />);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith(material.id);
  });

  it('should call onView when card is clicked', () => {
    const material = createTestMaterial();
    const onView = vi.fn();
    
    render(<MaterialCard material={material} onView={onView} />);

    const card = screen.getByTestId('material-card');
    fireEvent.click(card);

    expect(onView).toHaveBeenCalledWith(material);
  });

  it('should show out of stock badge when quantity is 0', () => {
    const material = new Material({
      id: 'mat-002',
      name: 'Out of Stock Material',
      type: MaterialType.METAL,
      width: 2000,
      height: 1000,
      thickness: 2,
      pricePerSquareMeter: 80,
      availableQuantity: 0,
      isActive: true,
    });

    render(<MaterialCard material={material} />);

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it('should show inactive badge when material is not active', () => {
    const material = new Material({
      id: 'mat-003',
      name: 'Inactive Material',
      type: MaterialType.WOOD,
      width: 2000,
      height: 1000,
      thickness: 18,
      pricePerSquareMeter: 50,
      availableQuantity: 5,
      isActive: false,
    });

    render(<MaterialCard material={material} />);

    expect(screen.getByText(/inactive/i)).toBeInTheDocument();
  });

  it('should calculate and display area', () => {
    const material = createTestMaterial();
    render(<MaterialCard material={material} />);

    // Area = 2.44 x 1.22 = 2.9768 m²
    expect(screen.getByText(/2.98 m²/i)).toBeInTheDocument();
  });

  it('should show material description when provided', () => {
    const material = createTestMaterial();
    render(<MaterialCard material={material} showDescription />);

    expect(screen.getByText('High quality plywood')).toBeInTheDocument();
  });

  it('should not show action buttons when disabled', () => {
    const material = createTestMaterial();
    render(<MaterialCard material={material} actionsDisabled />);

    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });
});