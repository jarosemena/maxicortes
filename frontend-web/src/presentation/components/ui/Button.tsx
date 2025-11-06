import React, { forwardRef } from 'react';
import {
  Button as MuiButton,
  ButtonProps as MuiButtonProps,
  CircularProgress,
  Box,
} from '@mui/material';

export interface ButtonProps extends Omit<MuiButtonProps, 'children'> {
  children: React.ReactNode;
  loading?: boolean;
  loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, loading = false, loadingText, disabled, startIcon, endIcon, ...props }, ref) => {
    const isDisabled = disabled || loading;

    const renderLoadingIcon = () => (
      <CircularProgress
        size={16}
        color="inherit"
        sx={{
          mr: startIcon && !endIcon ? 1 : 0,
          ml: endIcon && !startIcon ? 1 : 0,
        }}
      />
    );

    const getStartIcon = () => {
      if (loading && !endIcon) {
        return renderLoadingIcon();
      }
      return startIcon;
    };

    const getEndIcon = () => {
      if (loading && !startIcon) {
        return renderLoadingIcon();
      }
      return endIcon;
    };

    const getChildren = () => {
      if (loading && loadingText) {
        return loadingText;
      }
      if (loading && !startIcon && !endIcon) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {renderLoadingIcon()}
            {children}
          </Box>
        );
      }
      return children;
    };

    return (
      <MuiButton
        ref={ref}
        disabled={isDisabled}
        startIcon={getStartIcon()}
        endIcon={getEndIcon()}
        {...props}
      >
        {getChildren()}
      </MuiButton>
    );
  }
);

Button.displayName = 'Button';