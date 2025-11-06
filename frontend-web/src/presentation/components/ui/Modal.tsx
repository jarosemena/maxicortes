import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'extra-large';
  fullScreen?: boolean;
  showCloseButton?: boolean;
  disableBackdropClick?: boolean;
  disableEscapeKeyDown?: boolean;
  actions?: React.ReactNode;
  'aria-describedby'?: string;
}

const sizeMap = {
  small: 'sm',
  medium: 'md',
  large: 'lg',
  'extra-large': 'xl',
} as const;

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  title,
  size = 'medium',
  fullScreen = false,
  showCloseButton = false,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  actions,
  'aria-describedby': ariaDescribedBy,
}) => {
  const handleClose = (_event: any, reason?: string) => {
    if (reason === 'backdropClick' && disableBackdropClick) {
      return;
    }
    if (reason === 'escapeKeyDown' && disableEscapeKeyDown) {
      return;
    }
    onClose();
  };

  const titleId = title ? 'modal-title' : undefined;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={sizeMap[size]}
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby={titleId}
      aria-describedby={ariaDescribedBy}
      disableEscapeKeyDown={disableEscapeKeyDown}
    >
      {title && (
        <DialogTitle id={titleId}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            {showCloseButton && (
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        </DialogTitle>
      )}
      
      <DialogContent>
        {children}
      </DialogContent>
      
      {actions && (
        <DialogActions>
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
};