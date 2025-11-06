import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../utils/test-utils';
import { AppLayout } from '../../../../src/presentation/components/layout/AppLayout';

describe('AppLayout Component', () => {
  it('should render children content', () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );
    
    expect(screen.getByText(/test content/i)).toBeInTheDocument();
  });

  it('should render header with title', () => {
    render(
      <AppLayout title="MaxiCortes">
        <div>Content</div>
      </AppLayout>
    );
    
    expect(screen.getByText(/maxicortes/i)).toBeInTheDocument();
  });

  it('should render navigation menu', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );
    
    // Check for navigation items
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/materials/i)).toBeInTheDocument();
    expect(screen.getByText(/orders/i)).toBeInTheDocument();
    expect(screen.getByText(/optimization/i)).toBeInTheDocument();
  });

  it('should have responsive drawer behavior', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );
    
    const drawer = document.querySelector('.MuiDrawer-root');
    expect(drawer).toBeInTheDocument();
  });

  it('should render theme toggle button', () => {
    render(
      <AppLayout>
        <div>Content</div>
      </AppLayout>
    );
    
    const themeToggle = screen.getByRole('button', { name: /toggle theme/i });
    expect(themeToggle).toBeInTheDocument();
  });
});