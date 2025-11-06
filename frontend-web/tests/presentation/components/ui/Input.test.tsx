import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../utils/test-utils';
import { Input } from '../../../../src/presentation/components/ui/Input';

describe('Input Component', () => {
  it('should render with default props', () => {
    render(<Input label="Test Input" />);
    
    const input = screen.getByLabelText(/test input/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('should render with different types', () => {
    const { rerender } = render(<Input label="Email" type="email" />);
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');

    rerender(<Input label="Password" type="password" />);
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password');

    rerender(<Input label="Number" type="number" />);
    expect(screen.getByLabelText(/number/i)).toHaveAttribute('type', 'number');
  });

  it('should handle value changes', () => {
    const handleChange = vi.fn();
    render(<Input label="Test Input" onChange={handleChange} />);
    
    const input = screen.getByLabelText(/test input/i);
    fireEvent.change(input, { target: { value: 'test value' } });
    
    expect(handleChange).toHaveBeenCalledOnce();
  });

  it('should display error state', () => {
    render(<Input label="Test Input" error helperText="This field is required" />);
    
    const input = screen.getByLabelText(/test input/i);
    const helperText = screen.getByText(/this field is required/i);
    
    expect(input).toHaveClass('Mui-error');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('Mui-error');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input label="Test Input" disabled />);
    
    const input = screen.getByLabelText(/test input/i);
    expect(input).toBeDisabled();
  });

  it('should be required when required prop is true', () => {
    render(<Input label="Test Input" required />);
    
    const input = screen.getByLabelText(/test input/i);
    expect(input).toBeRequired();
    expect(screen.getByText(/test input \*/i)).toBeInTheDocument();
  });

  it('should render with placeholder', () => {
    render(<Input label="Test Input" placeholder="Enter text here" />);
    
    const input = screen.getByPlaceholderText(/enter text here/i);
    expect(input).toBeInTheDocument();
  });

  it('should render with helper text', () => {
    render(<Input label="Test Input" helperText="This is helper text" />);
    
    const helperText = screen.getByText(/this is helper text/i);
    expect(helperText).toBeInTheDocument();
  });

  it('should render with start adornment', () => {
    const StartIcon = () => <span data-testid="start-icon">@</span>;
    render(<Input label="Email" startAdornment={<StartIcon />} />);
    
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('should render with end adornment', () => {
    const EndIcon = () => <span data-testid="end-icon">$</span>;
    render(<Input label="Price" endAdornment={<EndIcon />} />);
    
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('should render multiline textarea', () => {
    render(<Input label="Description" multiline rows={4} />);
    
    const textarea = screen.getByLabelText(/description/i);
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Input label="Small" size="small" />);
    expect(screen.getByLabelText(/small/i)).toHaveClass('MuiInputBase-sizeSmall');

    rerender(<Input label="Medium" size="medium" />);
    expect(screen.getByLabelText(/medium/i)).not.toHaveClass('MuiInputBase-sizeSmall');
  });

  it('should render fullWidth when specified', () => {
    render(<Input label="Full Width" fullWidth />);
    
    const container = screen.getByLabelText(/full width/i).closest('.MuiFormControl-root');
    expect(container).toHaveClass('MuiFormControl-fullWidth');
  });

  it('should handle focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(<Input label="Test Input" onFocus={handleFocus} onBlur={handleBlur} />);
    
    const input = screen.getByLabelText(/test input/i);
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledOnce();
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledOnce();
  });

  it('should forward ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input label="Ref Input" ref={ref} />);
    
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it('should validate input with custom validation', () => {
    const validate = (value: string) => {
      if (value.length < 3) return 'Minimum 3 characters required';
      return '';
    };

    render(<Input label="Username" validate={validate} />);
    
    const input = screen.getByLabelText(/username/i);
    
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.blur(input);
    
    expect(screen.getByText(/minimum 3 characters required/i)).toBeInTheDocument();
  });
});