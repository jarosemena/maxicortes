import React from 'react';
import { Box, Typography } from '@mui/material';

const MaterialsPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Materials Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Manage your materials inventory - Implementation coming in Phase 2
      </Typography>
    </Box>
  );
};

export default MaterialsPage;