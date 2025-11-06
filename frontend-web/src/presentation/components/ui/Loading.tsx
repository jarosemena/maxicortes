import React from 'react';
import {
  CircularProgress,
  Box,
  Typography,
  Backdrop,
} from '@mui/material';

export interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'inherit';
  overlay?: boolean;
  centered?: boolean;
}

const sizeMap = {
  small: 24,
  medium: 40,
  large: 56,
};

export const Loading: React.FC<LoadingProps> = ({
  message,
  size = 'medium',
  color = 'primary',
  overlay = false,
  centered = false,
}) => {
  const loadingContent = (
    <Box
      className="loading-container"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        ...(centered && {
          justifyContent: 'center',
          minHeight: '200px',
        }),
      }}
    >
      <CircularProgress
        size={sizeMap[size]}
        color={color}
      />
      {message && (
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (overlay) {
    return (
      <Backdrop
        className="loading-overlay"
        open={true}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        {loadingContent}
      </Backdrop>
    );
  }

  return loadingContent;
};