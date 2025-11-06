import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../utils/test-utils';
import { ThemeContextProvider, useThemeContext } from '../../../../src/presentation/components/ui/ThemeProvider';

// Test component to access theme context
const TestComponent = () => {
  const { isDarkMode, toggleTheme } = useThemeContext();
  
  return (
    <div>
      <span data-testid="theme-mode">{isDarkMode ? 'dark' : 'light'}</span>
      <button data-testid="toggle-theme" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </div>
  );
};

describe('ThemeProvider', () => {
  it('should provide light theme by default', () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light');
  });

  it('should toggle to dark theme when button is clicked', () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    const themeMode = screen.getByTestId('theme-mode');

    expect(themeMode).toHaveTextContent('light');

    fireEvent.click(toggleButton);

    expect(themeMode).toHaveTextContent('dark');
  });

  it('should toggle back to light theme', () => {
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    const themeMode = screen.getByTestId('theme-mode');

    // Toggle to dark
    fireEvent.click(toggleButton);
    expect(themeMode).toHaveTextContent('dark');

    // Toggle back to light
    fireEvent.click(toggleButton);
    expect(themeMode).toHaveTextContent('light');
  });

  it('should persist theme preference in localStorage', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    
    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    const toggleButton = screen.getByTestId('toggle-theme');
    fireEvent.click(toggleButton);

    expect(setItemSpy).toHaveBeenCalledWith('maxicortes-theme', 'dark');
  });

  it('should load theme preference from localStorage', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    getItemSpy.mockReturnValue('dark');

    render(
      <ThemeContextProvider>
        <TestComponent />
      </ThemeContextProvider>
    );

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark');
  });

  it('should throw error when useThemeContext is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useThemeContext must be used within a ThemeContextProvider');

    consoleSpy.mockRestore();
  });
});