import React from 'react';
import { Box, Typography } from '@mui/material';

const OrdersPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Orders Management
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Create and manage cutting orders - Implementation coming in Phase 3
      </Typography>
    </Box>
  );
};

export default OrdersPage;