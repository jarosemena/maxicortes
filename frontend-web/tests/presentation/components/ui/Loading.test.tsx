import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { Loading } from '../../../../src/presentation/components/ui/Loading';

describe('Loading Component', () => {
  it('should render with default props', () => {
    render(<Loading />);
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<Loading message="Loading data..." />);
    
    expect(screen.getByText(/loading data.../i)).toBeInTheDocument();
  });

  it('should render with different sizes', () => {
    const { rerender } = render(<Loading size="small" />);
    let progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveClass('MuiCircularProgress-root');

    rerender(<Loading size="large" />);
    progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveClass('MuiCircularProgress-root');
  });

  it('should render fullscreen overlay when overlay is true', () => {
    render(<Loading overlay />);
    
    const overlay = document.querySelector('.loading-overlay');
    expect(overlay).toBeInTheDocument();
  });

  it('should render with custom color', () => {
    render(<Loading color="secondary" />);
    
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveClass('MuiCircularProgress-colorSecondary');
  });

  it('should center content when centered is true', () => {
    render(<Loading centered />);
    
    const container = document.querySelector('.loading-container');
    expect(container).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    });
  });
});