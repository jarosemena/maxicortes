import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import { ThemeContextProvider } from './presentation/components/ui/ThemeProvider';
import { AppLayout } from './presentation/components/layout/AppLayout';

// Placeholder components - will be implemented in later phases
const Dashboard = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Dashboard
    </Typography>
    <Typography variant="body1">
      Welcome to MaxiCortes - Material Cutting Optimization System
    </Typography>
  </Box>
);

const Materials = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Materials Management
    </Typography>
    <Typography variant="body1">
      Manage your materials inventory - Coming Soon
    </Typography>
  </Box>
);

const Orders = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Orders Management
    </Typography>
    <Typography variant="body1">
      Create and manage cutting orders - Coming Soon
    </Typography>
  </Box>
);

const Optimization = () => (
  <Box>
    <Typography variant="h4" gutterBottom>
      Cutting Optimization
    </Typography>
    <Typography variant="body1">
      Optimize material usage and visualize results - Coming Soon
    </Typography>
  </Box>
);

function App() {
  return (
    <ThemeContextProvider>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/materials" element={<Materials />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/optimization" element={<Optimization />} />
        </Routes>
      </AppLayout>
    </ThemeContextProvider>
  );
}

export default App;