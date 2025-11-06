import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../utils/test-utils';
import { Button } from '../../../../src/presentation/components/ui/Button';

describe('Button Component', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('MuiButton-containedPrimary');
  });

  it('should render with different variants', () => {
    const { rerender } = render(<Button variant="outlined">Outlined</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-outlined');

    rerender(<Button variant="text">Text</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-text');

    rerender(<Button variant="contained">Contained</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-contained');
  });

  it('should render with different colors', () => {
    const { rerender } = render(<Button color="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-containedPrimary');

    rerender(<Button color="secondary">Secondary</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-containedSecondary');

    rerender(<Button color="error">Error</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-containedError');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-sizeSmall');

    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-sizeMedium');

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole('button')).toHaveClass('MuiButton-sizeLarge');
  });

  it('should handle click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('Mui-disabled');
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render with loading state', () => {
    render(<Button loading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should render with start icon', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    render(<Button startIcon={<TestIcon />}>With Icon</Button>);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should render with end icon', () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;
    render(<Button endIcon={<TestIcon />}>With Icon</Button>);
    
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('should render fullWidth when specified', () => {
    render(<Button fullWidth>Full Width</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('MuiButton-fullWidth');
  });

  it('should apply custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('should have correct accessibility attributes', () => {
    render(<Button aria-label="Custom label">Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Custom label');
  });
});